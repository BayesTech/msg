import { NgMsgRequest } from '../ng-msg-request';
import { NgMsgBaseServiceBase } from '../ng-msg-base-service-base';
import { MessageQueueService } from './message-queue.service';

export interface MessageQueueServiceBase extends NgMsgBaseServiceBase {
    process(message: NgMsgRequest, messageQueueService: MessageQueueService): Promise<boolean>;
}