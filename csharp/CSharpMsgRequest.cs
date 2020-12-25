using Newtonsoft.Json;

namespace csharp_msg
{
    public class CSharpMsgRequest
    {
        public CSharpMsgRequestHeaders Headers { get; set; }

        public object Body { get; set; }

        public string Key => JsonConvert.SerializeObject(new { Headers.Route, Headers.RequestMethod });
    }
}
