using System;
using System.Collections.Generic;

namespace csharp_msg
{
    public class CSharpMsgRequestBuilder
    {
        private readonly CSharpMsgRequest _request;
        private readonly CSharpMsgRequestHeaders _headers;

        public CSharpMsgRequestBuilder() : this(string.Empty)
        {
        }

        public CSharpMsgRequestBuilder(string route)
        {
            _request = new CSharpMsgRequest();
            _headers = new CSharpMsgRequestHeaders
            {
                Route = route,
                Custom = new Dictionary<string, string>(),
                RequestId = Guid.NewGuid().ToString()
            };
        }

        public CSharpMsgRequestBuilder WithBody(object body)
        {
            _request.Body = body;
            return this;
        }

        public CSharpMsgRequestBuilder WithRequestId(string requestId)
        {
            _headers.RequestId = requestId;
            return this;
        }

        public CSharpMsgRequestBuilder WithRequestMethod(CSharpMsgRequestMethod method)
        {
            _headers.RequestMethod = method;
            return this;
        }

        public CSharpMsgRequestBuilder WithRequireResponse(bool requireResponse)
        {
            _headers.RequireResponse = requireResponse;
            return this;
        }

        public CSharpMsgRequestBuilder WithCustom(string key, string value)
        {
            _headers.Custom[key] = value;
            return this;
        }

        public CSharpMsgRequest Build()
        {
            _request.Headers = _headers;
            return _request;
        }
    }
}
