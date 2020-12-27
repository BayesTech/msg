using System;
using System.Threading.Tasks;

namespace CSharpMsg
{
    public interface ICSharpMsgMessageQueueAdapter
    {
        void Subscribe(Action<CSharpMsgRequest> OnRequestReceived);

        void SubscribeAsync(Func<CSharpMsgRequest, Task> OnRequestReceivedAsync);

        void Unsubscribe();

        void UnsubscribeAsync();
    }
}
