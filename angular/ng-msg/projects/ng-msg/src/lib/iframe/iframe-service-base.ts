import { NgMsgRequest } from '../ng-msg-request';
import { NgMsgBaseServiceBase } from '../ng-msg-base-service-base';
import { IframeService } from './iframe.service';

export interface IframeServiceBase extends NgMsgBaseServiceBase {
    process(message: NgMsgRequest, iframeService: IframeService): Promise<boolean>;
}