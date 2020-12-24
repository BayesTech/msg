import { NgMsgRequestMethod } from './ng-msg-request-method';

export class NgMsgRequestHeaders {
    public route: string;
    public requestId: string;
    public requireResponse: boolean;
    public requestMethod: NgMsgRequestMethod;
    public custom: Map<string, string>;
}