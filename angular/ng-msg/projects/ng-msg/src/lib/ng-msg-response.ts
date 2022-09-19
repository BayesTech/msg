import { NgMsgResponseHeaders } from './ng-msg-response-headers';
import { NgMsgStatusCode } from './ng-msg-status-code';

export class NgMsgResponse {
  public headers: NgMsgResponseHeaders = new NgMsgResponseHeaders(
    NgMsgStatusCode.InternalError
  );
  public body: any;
}
