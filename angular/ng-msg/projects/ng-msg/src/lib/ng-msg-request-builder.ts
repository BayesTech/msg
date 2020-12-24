import { NgMsgRequest } from './ng-msg-request';
import { NgMsgRequestHeaders } from './ng-msg-request-headers';
import { v4 } from 'uuid';
import { NgMsgRequestMethod } from './ng-msg-request-method';

export class NgMsgRequestBuilder {
    private _request: NgMsgRequest;
    private _requestHeaders: NgMsgRequestHeaders;

    public constructor(route: string) {
        this._request = new NgMsgRequest();
        this._requestHeaders = new NgMsgRequestHeaders();
        this._requestHeaders.requestId = v4();
        this._requestHeaders.requireResponse = false;
        this._requestHeaders.route = route;
        this._requestHeaders.custom = new Map<string, string>();
        this._requestHeaders.requestMethod = NgMsgRequestMethod.GET;
    }

    public withRequireResponse(requireResponse: boolean = true): NgMsgRequestBuilder {
        this._requestHeaders.requireResponse = requireResponse;
        return this;
    }

    public withRequestMethod(method: NgMsgRequestMethod): NgMsgRequestBuilder {
        this._requestHeaders.requestMethod = method;
        return this;
    }

    public withBody(body: any): NgMsgRequestBuilder {
        this._request.body = body;
        return this;
    }

    public withRequestId(requestId: string): NgMsgRequestBuilder {
        this._requestHeaders.requestId = requestId;
        return this;
    }

    public withCustomHeader(key: string, value: string): NgMsgRequestBuilder {
        this._requestHeaders.custom.set(key, value);
        return this;
    }

    public build(): NgMsgRequest {
        this._request.headers = this._requestHeaders;
        return this._request;
    }
}