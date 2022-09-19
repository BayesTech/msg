import { NgMsgRequestMethod } from './ng-msg-request-method';

export class NgMsgRequestHeaders {
  public route: string = '';
  public requestId: string = '';
  public requireResponse: boolean = false;
  public requestMethod: NgMsgRequestMethod = NgMsgRequestMethod.GET;
  public custom: Map<string, string> = new Map<string, string>();
}
