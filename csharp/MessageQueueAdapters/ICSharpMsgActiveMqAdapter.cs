using System;

namespace csharp_msg.MessageQueueAdapters
{
    public interface ICSharpMsgActiveMqAdapter : ICSharpMsgMessageQueueAdapter
    {
        void RegisterConsumer(string suffix);
        void UnregisterConsumer();
        void Publish(string suffix, CSharpMsgRequest request);
        void PublishAndWait(string suffix, CSharpMsgRequest request, Action<CSharpMsgResponse> onResponseReceived);
    }
}