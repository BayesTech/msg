import { Injectable, Injector, OnDestroy } from '@angular/core';
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { MessageQueueConfigurationBase } from './message-queue-configuration-base';
import { MessageQueueOptions } from './message-queue-options';
import { MessageQueueServiceBase } from './message-queue-service-base';
import { Message as StompMessage } from '@stomp/stompjs';
import { NgMsgRequest } from '../ng-msg-request';
import { NgMsgResponse } from '../ng-msg-response';
import { filter, first, map, timeout } from 'rxjs/operators';
import { NgMsgBaseService } from '../ng-msg-base-service';

@Injectable({
  providedIn: 'root',
})
export class MessageQueueService extends NgMsgBaseService implements OnDestroy {
  private _rxStompService?: RxStompService;
  private _subscription?: Subscription;
  private _routeServiceMapping?: Map<string, MessageQueueServiceBase>;
  private _messageQueueConfigurationBase?: MessageQueueConfigurationBase;

  constructor(
    private _injector: Injector,
    private _options: MessageQueueOptions
  ) {
    super();
    this.buildRouteServiceMapping();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public subscribe(
    destination: string,
    messageQueueConfigurationBase: MessageQueueConfigurationBase
  ): Subscription {
    this._messageQueueConfigurationBase = messageQueueConfigurationBase;
    this._rxStompService = rxStompServiceFactory(
      this.buildConfiguration(this._options.isDebug)
    );

    this._subscription = this._rxStompService
      .watch(destination)
      .subscribe(async (stompMessage: StompMessage) => {
        this.process(stompMessage);
      });
    return this._subscription;
  }

  public async process(stompMessage: StompMessage): Promise<void> {
    const request: NgMsgRequest = JSON.parse(stompMessage.body) as NgMsgRequest;
    if ('headers' in request) {
      const routeKey: string = this.getRouteKey(
        request.headers.route,
        request.headers.requestMethod
      );
      if (this._routeServiceMapping?.has(routeKey)) {
        const service: MessageQueueServiceBase | undefined =
          this._routeServiceMapping.get(routeKey);
        if (service) {
          await service.process(request, this);
        } else {
          throw new Error(
            `Route ${routeKey} is registered with undefined service/processor`
          );
        }
      } else {
        throw new Error(`Route ${routeKey} in message is not registered`);
      }
    } else {
      throw new Error(
        'Fail to process message. Headers are missing from thre request.'
      );
    }
  }

  public unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  public publish = (
    destination: string,
    message: NgMsgRequest | NgMsgResponse
  ): void => {
    if (!this._rxStompService) {
      console.error('Message queue not connected');
    }

    const publishParams = {
      destination: destination,
      body: JSON.stringify(message),
    };
    this._rxStompService?.publish(publishParams);
  };

  public publishAndWaitForResponse = async (
    destination: string,
    message: NgMsgRequest | NgMsgResponse,
    timeoutInMs: number = 10000
  ): Promise<NgMsgResponse | undefined> => {
    if (this._rxStompService) {
      this.publish(destination, message);
      return this._rxStompService
        .watch(destination)
        .pipe(
          map((response) => JSON.parse(response.body) as NgMsgResponse),
          filter((response) => this.responseFilter(message, response)),
          timeout(timeoutInMs),
          first()
        )
        .toPromise();
    } else {
      throw new Error('rxStomService is not initialised');
    }
  };

  private responseFilter = (
    message: NgMsgRequest | NgMsgResponse,
    response: NgMsgResponse
  ): boolean => {
    if (response && response.headers && message instanceof NgMsgRequest) {
      return response.headers.responseId === message.headers.requestId;
    }
    return false;
  };

  private buildRouteServiceMapping = () => {
    this._routeServiceMapping = new Map<string, MessageQueueServiceBase>();
    this._options.injectionTokens.forEach((injectionToken) => {
      const service: MessageQueueServiceBase =
        this._injector.get(injectionToken);
      this._routeServiceMapping?.set(
        this.getRouteKey(service.route, service.requestMethod),
        service
      );
    });
  };

  private buildConfiguration(
    isDebug: boolean = false
  ): InjectableRxStompConfig {
    let injectableRxStompConfig: InjectableRxStompConfig =
      new InjectableRxStompConfig();
    injectableRxStompConfig.brokerURL =
      this._messageQueueConfigurationBase?.wssUrl;
    injectableRxStompConfig.connectHeaders = {
      login: this._messageQueueConfigurationBase?.username ?? '',
      passcode: this._messageQueueConfigurationBase?.password ?? '',
    };
    injectableRxStompConfig.heartbeatIncoming = 0;
    injectableRxStompConfig.heartbeatOutgoing = 20000;
    injectableRxStompConfig.reconnectDelay = 200;

    if (isDebug) {
      injectableRxStompConfig.debug = (msg: string): void => {
        console.log(new Date(), msg);
      };
    }
    return injectableRxStompConfig;
  }
}
