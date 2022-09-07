import { NgMsgRequest } from '../ng-msg-request';
import { NgMsgRequestBuilder } from '../ng-msg-request-builder';
import { NgMsgRequestHeaders } from '../ng-msg-request-headers';
import { v4 } from 'uuid';
import { NgMsgRequestMethod } from '../ng-msg-request-method';

describe('NgMsgRequestBuilder', () => {
  it('should create default request', () => {
    const headers = new NgMsgRequestHeaders();
    headers.requestId = v4();
    headers.requireResponse = false;
    headers.route = 'route';
    headers.custom = new Map<string, string>();
    headers.requestMethod = NgMsgRequestMethod.GET;

    const expectedRequest = new NgMsgRequest();
    expectedRequest.headers = headers;

    const builder = new NgMsgRequestBuilder(
      expectedRequest.headers.route,
      headers.requestId
    );
    const actualRequest = builder.build();

    expect(actualRequest.headers).toEqual(headers);
  });

  describe('withRequireResponse', () => {
    const testCases = [{ requireResponse: true }, { requireResponse: false }];

    testCases.forEach((testCase) => {
      it(`should set requireResponse to ${testCase.requireResponse} in header`, () => {
        const builder = new NgMsgRequestBuilder('route', 'requestId');
        builder.withRequireResponse(testCase.requireResponse);
        const request = builder.build();

        expect(request.headers.requireResponse).toBe(testCase.requireResponse);
      });
    });
  });

  describe('withRequestMethod', () => {
    it(`should set requestMethod in header`, () => {
      const builder = new NgMsgRequestBuilder('route', 'requestId');
      builder.withRequestMethod(NgMsgRequestMethod.POST);
      const request = builder.build();

      expect(request.headers.requestMethod).toBe(NgMsgRequestMethod.POST);
    });
  });

  describe('withBody', () => {
    it(`should set bpdy in request`, () => {
      const builder = new NgMsgRequestBuilder('route', 'requestId');
      const body = { content: 'body' };
      builder.withBody(body);
      const request = builder.build();

      expect(request.body).toEqual(body);
    });
  });

  describe('withCustomHeader', () => {
    it('should set custom header in the header', () => {
      const builder = new NgMsgRequestBuilder('route', 'requestId');
      const customHeaderKey = 'custom header key';
      const customHeaderValue = 'custom header value';

      builder.withCustomHeader(customHeaderKey, customHeaderValue);
      const request = builder.build();

      expect(request.headers.custom).toHaveSize(1);
      expect(request.headers.custom.has(customHeaderKey)).toBeTruthy();
      expect(request.headers.custom.get(customHeaderKey)).toBe(
        customHeaderValue
      );
    });
  });
});
