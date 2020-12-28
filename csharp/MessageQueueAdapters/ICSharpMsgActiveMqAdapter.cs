using System;

namespace CSharpMsg.MessageQueueAdapters
{
    public interface ICSharpMsgActiveMqAdapter : ICSharpMsgMessageQueueAdapter
    {
        string RegisterProducer(string suffix, CSharpMsgActiveMqType type);
        void RegisterConsumer(string suffix);
        void UnregisterConsumer();
        bool Publish(string suffix, CSharpMsgActiveMqType type, CSharpMsgRequest request);
        void PublishAndWait(string suffix, CSharpMsgActiveMqType type, CSharpMsgRequest request, Action<CSharpMsgResponse> onResponseReceived);
    }
}