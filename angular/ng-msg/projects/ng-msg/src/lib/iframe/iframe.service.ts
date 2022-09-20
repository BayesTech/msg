import { Injectable, Injector, OnDestroy } from '@angular/core';
import { fromEvent, lastValueFrom, Subscription } from 'rxjs';
import { filter, first, timeout } from 'rxjs/operators';
import { NgMsgBaseService } from '../ng-msg-base-service';
import { NgMsgRequest } from '../ng-msg-request';
import { NgMsgResponse } from '../ng-msg-response';
import { IframeOptions } from './iframe-options';
import { IframeServiceBase } from './iframe-service-base';

@Injectable({
  providedIn: 'root',
})
export class IframeService extends NgMsgBaseService implements OnDestroy {
  public defaultTargetUri: string;
  public defaultTargetWindow: Window;
  private _subscription?: Subscription;
  private _routeServiceMapping: Map<string, IframeServiceBase> = new Map<
    string,
    IframeServiceBase
  >();

  constructor(private _injector: Injector, private _options: IframeOptions) {
    super();
    this.defaultTargetUri = this._options.defaultTargetUri;
    this.defaultTargetWindow = this._options.defaultTargetWindow;
    this.buildRouteServiceMapping();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public publish = (
    message: NgMsgRequest | NgMsgResponse,
    targetUri?: string,
    targetWindow?: Window | MessageEventSource | null
  ): void => {
    if (targetUri && targetWindow) {
      (targetWindow as Window).postMessage(message, targetUri);
    } else if (this.defaultTargetUri && this.defaultTargetWindow) {
      this.defaultTargetWindow.postMessage(message, this.defaultTargetUri);
    } else {
      throw new Error('No target uri and/or target window set');
    }
  };

  public publishAndWaitForResponse = async (
    message: NgMsgRequest | NgMsgResponse,
    targetUri?: string,
    targetWindow?: Window,
    timeoutInMs: number = 10000
  ): Promise<Event | undefined> => {
    this.publish(message, targetUri, targetWindow);
    return await lastValueFrom(
      fromEvent(window, 'message').pipe(
        filter((event) => this.responseFilter(message, event)),
        timeout(timeoutInMs),
        first()
      )
    );
  };

  private responseFilter = (
    message: NgMsgRequest | NgMsgResponse,
    responseEvent: Event
  ): boolean => {
    if (responseEvent instanceof MessageEvent) {
      const response = responseEvent.data as NgMsgResponse;
      if (response && response.headers && message instanceof NgMsgRequest) {
        return response.headers.responseId === message.headers.requestId;
      }
      return false;
    }
    return false;
  };

  public subscribe = (): Subscription => {
    if (window) {
      this._subscription = fromEvent(window, 'message').subscribe(
        async (event) => {
          await this.process(event);
        }
      );
      return this._subscription;
    } else {
      throw new Error('window object is not ready');
    }
  };

  public process = async (event: Event): Promise<void> => {
    const messageEvent: MessageEvent = event as MessageEvent;
    const request: NgMsgRequest = messageEvent.data;
    if ('headers' in request) {
      const routeKey: string = this.getRouteKey(
        request.headers.route,
        request.headers.requestMethod
      );
      if (this._routeServiceMapping.has(routeKey)) {
        const service: IframeServiceBase | undefined =
          this._routeServiceMapping.get(routeKey);
        await service?.process(request, this);
      } else if (
        !(messageEvent.source instanceof MessagePort) ||
        !(messageEvent.source instanceof ServiceWorker)
      ) {
        this.publish(request, messageEvent.origin, messageEvent.source);
      } else {
        throw new Error(
          'Route in message is not registered and cannot send response to source'
        );
      }
    }
  };

  public unsubscribe = () => {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  };

  private buildRouteServiceMapping = () => {
    this._routeServiceMapping = new Map<string, IframeServiceBase>();
    this._options.injectionTokens.forEach((injectionToken) => {
      const service: IframeServiceBase = this._injector.get(injectionToken);
      this._routeServiceMapping.set(
        this.getRouteKey(service.route, service.requestMethod),
        service
      );
    });
  };
}
