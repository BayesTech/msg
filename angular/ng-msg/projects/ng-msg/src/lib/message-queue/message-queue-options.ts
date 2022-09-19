import { InjectionToken } from '@angular/core';
import { MessageQueueServiceBase } from './message-queue-service-base';

export class MessageQueueOptions {
  public injectionTokens: InjectionToken<MessageQueueServiceBase>[] = [];
  public isDebug: boolean = false;
}
