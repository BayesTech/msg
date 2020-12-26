using Newtonsoft.Json;
using System.Threading.Tasks;

namespace CSharpMsg
{
    public abstract class CSharpMsgEndpointServiceBase : ICSharpMsgEndpointService
    {
        public string Route { get; private set; }

        public CSharpMsgRequestMethod RequestMethod { get; private set; }

        public virtual void Process(CSharpMsgRequest request)
        {

        }

        public virtual Task ProcessAsync(CSharpMsgRequest request)
        {
            return Task.CompletedTask;
        }

        public string Key => JsonConvert.SerializeObject(new { Route, RequestMethod });

        public CSharpMsgEndpointServiceBase(string route)
        {
            Route = route;
            RequestMethod = CSharpMsgRequestMethod.GET;
        }

        public CSharpMsgEndpointServiceBase(string route, CSharpMsgRequestMethod method)
        {
            Route = route;
            RequestMethod = method;
        }
    }
}
