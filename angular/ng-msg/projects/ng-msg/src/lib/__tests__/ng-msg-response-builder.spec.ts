import { NgMsgResponseBuilder } from '../ng-msg-response-builder';
import { NgMsgResponseHeaders } from '../ng-msg-response-headers';
import { NgMsgStatusCode } from '../ng-msg-status-code';

describe('NgMsgResponseBuilder', () => {
  it('should have default header', () => {
    const builder = new NgMsgResponseBuilder();

    const expectedHeader = new NgMsgResponseHeaders();
    expectedHeader.statusCode = NgMsgStatusCode.Ok;
    expectedHeader.custom = new Map<string, string>();

    const response = builder.build();
    expect(response.headers).toEqual(expectedHeader);
  });

  describe('withBody', () => {
    it('should set body of the response', () => {
      const builder = new NgMsgResponseBuilder();
      const body = { content: 'body' };
      builder.withBody(body);

      const response = builder.build();

      expect(response.body).toEqual(body);
    });
  });

  describe('withResponseId', () => {
    it('should set responseId in the header of the response', () => {
      const builder = new NgMsgResponseBuilder();
      const responseId = 'response id';

      builder.withResponseId(responseId);
      const response = builder.build();

      expect(response.headers.responseId).toEqual(responseId);
    });
  });

  describe('withStatusCode', () => {
    it('should set status code in the header of the response', () => {
      const builder = new NgMsgResponseBuilder();
      const statusCode = NgMsgStatusCode.BadRequest;

      builder.withStatusCode(statusCode);
      const response = builder.build();

      expect(response.headers.statusCode).toEqual(statusCode);
    });
  });

  describe('withCustomHeader', () => {
    it('should set custom header in the header of the response', () => {
      const builder = new NgMsgResponseBuilder();
      const customHeaderKey = 'custom header key';
      const customHeaderValue = 'custom header value';

      builder.withCustomHeader(customHeaderKey, customHeaderValue);
      const response = builder.build();

      expect(response.headers.custom).toHaveSize(1);
      expect(response.headers.custom.has(customHeaderKey)).toBeTruthy();
      expect(response.headers.custom.get(customHeaderKey)).toBe(
        customHeaderValue
      );
    });
  });
});
