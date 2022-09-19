import { NgMsgStatusCode } from './ng-msg-status-code';

export class NgMsgResponseHeaders {
  public custom: Map<string, string> = new Map<string, string>();
  public responseId: string = '';

  constructor(public statusCode: NgMsgStatusCode) {}
}
