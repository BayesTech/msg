using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpMsg
{
    public class CSharpMsgMessageQueueService : ICSharpMsgMessageQueueService
    {
        private readonly ICSharpMsgMessageQueueAdapter _adapter;
        private readonly IDictionary<string, ICSharpMsgEndpointService> _endpointServices;

        public CSharpMsgMessageQueueService(
            ICSharpMsgMessageQueueAdapter adapter,
            IEnumerable<ICSharpMsgEndpointService> endpointServices)
        {
            _adapter = adapter;
            _endpointServices = endpointServices.ToDictionary(service => service.Key, service => service);
        }

        public void Subscribe()
        {
            _adapter.Subscribe(OnRequestReceived);
            _adapter.SubscribeAsync(OnRequestReceivedAsync);
        }

        public void Unsubscribe()
        {
            _adapter.Unsubscribe();
            _adapter.UnsubscribeAsync();
        }

        private void OnRequestReceived(CSharpMsgRequest request)
        {
            _endpointServices[request.Key].Process(request);
        }

        private async Task OnRequestReceivedAsync(CSharpMsgRequest request)
        {
            await _endpointServices[request.Key].ProcessAsync(request);
        }
    }
}
