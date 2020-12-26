using System.Collections.Generic;

namespace csharp_msg
{
    public class CSharpMsgResponseBuilder
    {
        private readonly CSharpMsgResponse _response;
        private readonly CSharpMsgResponseHeaders _headers;

        public CSharpMsgResponseBuilder()
        {
            _response = new CSharpMsgResponse();
            _headers = new CSharpMsgResponseHeaders
            {
                Custom = new Dictionary<string, string>(),
                StatusCode = CSharpMsgStatusCode.Ok
            };
        }

        public CSharpMsgResponseBuilder WithBody(object body)
        {
            _response.Body = body;
            return this;
        }

        public CSharpMsgResponseBuilder WithResponseId(string responseId)
        {
            _headers.ResponseId = responseId;
            return this;
        }

        public CSharpMsgResponseBuilder WithStatusCode(CSharpMsgStatusCode statusCode)
        {
            _headers.StatusCode = statusCode;
            return this;
        }

        public CSharpMsgResponseBuilder WithCustom(string key, string value)
        {
            _headers.Custom[key] = value;
            return this;
        }

        public CSharpMsgResponse Build()
        {
            _response.Headers = _headers;
            return _response;
        }
    }
}
