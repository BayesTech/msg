using System.Collections.Generic;

namespace csharp_msg
{
    public class CSharpMsgRequestHeaders
    {
        public string Route { get; set; }

        public string RequestId { get; set; }

        public CSharpMsgRequestMethod RequestMethod { get; set; }

        public bool RequireResponse { get; set; }

        public IDictionary<string, string> Custom { get; set; }
    }
}
