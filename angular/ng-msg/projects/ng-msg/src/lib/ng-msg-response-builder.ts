import { NgMsgResponse } from './ng-msg-response';
import { NgMsgResponseHeaders } from './ng-msg-response-headers';
import { NgMsgStatusCode } from './ng-msg-status-code';

export class NgMsgResponseBuilder {
    private _response: NgMsgResponse;
    private _responseHeaders: NgMsgResponseHeaders;

    public constructor() {
        this._response = new NgMsgResponse();
        this._responseHeaders = new NgMsgResponseHeaders();
        this._responseHeaders.statusCode = NgMsgStatusCode.Ok;
        this._responseHeaders.custom = new Map<string, string>();
    }

    public withBody(body: any): NgMsgResponseBuilder {
        this._response.body = body;
        return this;
    }

    public withResponseId(responseId: string): NgMsgResponseBuilder {
        this._responseHeaders.responseId = responseId;
        return this;
    }

    public withStatusCode(statusCode: NgMsgStatusCode): NgMsgResponseBuilder {
        this._responseHeaders.statusCode = statusCode;
        return this;
    }

    public withCustomHeader(key: string, value: string): NgMsgResponseBuilder {
        this._responseHeaders.custom.set(key, value);
        return this;
    }

    public build(): NgMsgResponse {
        this._response.headers = this._responseHeaders;
        return this._response;
    }
}