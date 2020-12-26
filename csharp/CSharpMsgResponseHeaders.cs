using System.Collections.Generic;

namespace CSharpMsg
{
    public class CSharpMsgResponseHeaders
    {
        public CSharpMsgStatusCode StatusCode { get; set; }

        public string ResponseId { get; set; }

        public IDictionary<string, string> Custom { get; set; }
    }
}
