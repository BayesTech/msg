import { NgMsgStatusCode } from './ng-msg-status-code';

export class NgMsgResponseHeaders {
    public statusCode: NgMsgStatusCode;
    public custom: Map<string, string>;
    public responseId: string;
}