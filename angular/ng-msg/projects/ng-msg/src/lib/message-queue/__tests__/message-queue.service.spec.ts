import { MessageQueueService } from '../message-queue.service';
import { InjectionToken, ProviderToken } from '@angular/core';
import { MessageQueueServiceBase } from '../message-queue-service-base';
import { NgMsgRequest } from '../../ng-msg-request';
import { NgMsgRequestMethod } from '../../ng-msg-request-method';
import { MessageQueueOptions } from '../message-queue-options';
import { StompHeaders } from '@stomp/stompjs';
import { Message as StompMessage } from '@stomp/stompjs';
import { NgMsgRequestHeaders } from '../../ng-msg-request-headers';

const createMessageQueueService = (
  route: string,
  requestMethod: NgMsgRequestMethod
) => {
  const testService = jasmine.createSpyObj('MessageQueueServiceBase', [
    'process',
  ]);
  testService.route = route;
  testService.requestMethod = requestMethod;
  return testService;
};

const createNgMsgRequestHeaders = (
  route: string,
  requestMethod: NgMsgRequestMethod
) => {
  const headers = new NgMsgRequestHeaders();
  headers.route = route;
  headers.requestMethod = requestMethod;

  return headers;
};

const createNgMsgRequest = (
  route: string,
  requestMethod: NgMsgRequestMethod
) => {
  const requestHeader = createNgMsgRequestHeaders(route, requestMethod);

  const request: NgMsgRequest = new NgMsgRequest();
  request.body = 'content body';
  request.headers = requestHeader;

  return request;
};

const createStompMessage = (body: string) => {
  const message: StompMessage = {
    ack: (headers?: StompHeaders) => {},
    nack: (headers?: StompHeaders) => {},
    command: '',
    headers: new StompHeaders(),
    isBinaryBody: false,
    body: body,
    binaryBody: undefined,
  };

  return message;
};

const createMockInjector = (messageQueueService: MessageQueueService) => {
  var mockedInjector = jasmine.createSpyObj('Injector', ['get']);
  mockedInjector.get = (key: ProviderToken<MessageQueueServiceBase>) => {
    if (key.toString() === 'InjectionToken GET-route') {
      return messageQueueService;
    }
  };

  return mockedInjector;
};

const createMessageQueueOptions = () => {
  var options = new MessageQueueOptions();
  options.injectionTokens = [
    new InjectionToken<MessageQueueServiceBase>('GET-route'),
  ];

  return options;
};

describe('MessageQueueService', () => {
  describe('prcoess', () => {
    it('should throw error when headers are not found in request', async () => {
      var mockedInjector = jasmine.createSpyObj('Injector', ['get']);

      var options = new MessageQueueOptions();
      options.injectionTokens = [];

      const service = new MessageQueueService(mockedInjector, options);
      const request = { body: 'content body' };
      const message = createStompMessage(JSON.stringify(request));

      await expectAsync(service.process(message)).toBeRejectedWith(
        new Error(
          'Fail to process message. Headers are missing from thre request.'
        )
      );
    });

    it('should throw exception when expected route key is not found', async () => {
      const testService = createMessageQueueService(
        'route',
        NgMsgRequestMethod.GET
      );
      var mockedInjector = createMockInjector(testService);
      var options = createMessageQueueOptions();

      const service = new MessageQueueService(mockedInjector, options);

      const request = createNgMsgRequest('route', NgMsgRequestMethod.POST);

      const message: StompMessage = createStompMessage(JSON.stringify(request));

      await expectAsync(service.process(message)).toBeRejectedWith(
        new Error('Route POST-route in message is not registered')
      );
    });

    it('should run process when expected route key is found', async () => {
      const testService = createMessageQueueService(
        'route',
        NgMsgRequestMethod.GET
      );
      var mockedInjector = createMockInjector(testService);
      var options = createMessageQueueOptions();

      const service = new MessageQueueService(mockedInjector, options);

      const request = createNgMsgRequest('route', NgMsgRequestMethod.GET);

      const message: StompMessage = createStompMessage(JSON.stringify(request));

      service.process(message);
      expect(testService.process).toHaveBeenCalledOnceWith(
        { body: 'content body', headers: { route: 'route', requestMethod: 0 } },
        service
      );
    });
  });
});
