using Apache.NMS;
using Apache.NMS.ActiveMQ.Commands;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CSharpMsg.MessageQueueAdapters
{
    public class CSharpMsgActiveMqAdapter : ICSharpMsgActiveMqAdapter
    {
        private readonly ILogger<CSharpMsgActiveMqAdapter> _logger;
        private readonly CSharpMsgActiveMqConfiguration _activeMqConfiguration;
        private readonly JsonSerializerSettings _jsonSettins = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        private IMessageConsumer _consumer;
        private IDictionary<string, IMessageProducer> _producers;
        private IConnection _connection;
        private ISession _session;
        private MessageListener _subscriber;
        private MessageListener _subscriberAsync;

        public CSharpMsgActiveMqAdapter(
            ILogger<CSharpMsgActiveMqAdapter> logger,
            CSharpMsgActiveMqConfiguration activeMqConfiguration)
        {
            _logger = logger;
            _activeMqConfiguration = activeMqConfiguration;
            _producers = new ConcurrentDictionary<string, IMessageProducer>();
            Initialise();
        }

        private void Initialise()
        {
            try
            {
                var uri = new Uri(_activeMqConfiguration.OpenWireUrl);
                NMSConnectionFactory factory = new NMSConnectionFactory(uri);
                _connection = factory.CreateConnection(_activeMqConfiguration.Username, _activeMqConfiguration.Password);
                _connection.Start();
                _session = _connection.CreateSession(AcknowledgementMode.AutoAcknowledge);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Unable to create connection to ActiveMq");
            }
        }

        public void RegisterConsumer(string suffix)
        {
            try
            {
                string topicQueueName = _activeMqConfiguration.TopicQueueName + suffix;
                _consumer = _session.CreateConsumer(_session.GetTopic(topicQueueName));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Unable to create consumer");
            }
        }

        public string RegisterProducer(string suffix, CSharpMsgActiveMqType type)
        {
            string topicQueueName = _activeMqConfiguration.TopicQueueName + suffix;
            if (!_producers.ContainsKey(topicQueueName))
            {
                IDestination destination = null;
                if (type == CSharpMsgActiveMqType.Queue)
                {
                    destination = new ActiveMQQueue(topicQueueName);
                }
                else if (type == CSharpMsgActiveMqType.Topic)
                {
                    destination = new ActiveMQTopic(topicQueueName);
                }

                if (destination == null)
                {
                    _logger.LogError("Given CSharpMsgActiveMqType is not valid. Unable to create destination");
                    return string.Empty;
                }

                _producers[topicQueueName] = _session.CreateProducer(destination);
                return topicQueueName;
            }

            return topicQueueName;
        }

        public void UnregisterConsumer()
        {
            if (_consumer != null)
            {
                _consumer.Close();
                _consumer.Dispose();
            }

            if (_producers != null)
            {
                foreach (IMessageProducer producer in _producers.Values)
                {
                    producer.Close();
                }
                _producers = new Dictionary<string, IMessageProducer>();
            }

            if (_session != null)
            {
                _session.Close();
                _session.Dispose();
            }

            if (_connection != null)
            {
                _connection.Close();
                _connection.Dispose();
            }
        }

        public bool Publish(string suffix, CSharpMsgActiveMqType type, CSharpMsgRequest request)
        {
            string topicQueueName = RegisterProducer(suffix, type);
            if (string.IsNullOrWhiteSpace(topicQueueName))
            {
                _logger.LogError("Fail to publish request. Possible reason is unable to register producer. Please check the CSharpMsgActiveMqType.");
                return false;
            }

            try
            {
                string serialisedMessage = JsonConvert.SerializeObject(request, _jsonSettins);
                ITextMessage message = _session.CreateTextMessage(serialisedMessage);
                _producers[topicQueueName].Send(message, MsgDeliveryMode.NonPersistent, MsgPriority.Highest, TimeSpan.FromSeconds(5));
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Fail to publish request");
                return false;
            }
        }

        public void PublishAndWait(string suffix, CSharpMsgActiveMqType type, CSharpMsgRequest request, Action<CSharpMsgResponse> onResponseReceived)
        {
            string topicQueueName = _activeMqConfiguration.TopicQueueName + suffix;
            _consumer = _session.CreateConsumer(_session.GetTopic(topicQueueName));
            if(Publish(suffix, type, request))
            {
                ITextMessage message = (ITextMessage)_consumer.Receive(new TimeSpan(0, 1, 0));
                if (message == null)
                {
                    _logger.LogError("Timeout");
                    CSharpMsgResponse response = new CSharpMsgResponseBuilder().WithStatusCode(CSharpMsgStatusCode.Timeout).Build();
                    onResponseReceived(response);
                }

                onResponseReceived(JsonConvert.DeserializeObject<CSharpMsgResponse>(message.Text, _jsonSettins));
            }
        }

        public void Subscribe(Action<CSharpMsgRequest> OnRequestReceived)
        {
            _subscriber = (IMessage message) =>
            {
                ITextMessage msg = (ITextMessage)message;
                CSharpMsgRequest request = JsonConvert.DeserializeObject<CSharpMsgRequest>(msg.Text, _jsonSettins);
                OnRequestReceived(request);
            };
            _consumer.Listener += _subscriber;
        }

        public void SubscribeAsync(Func<CSharpMsgRequest, Task> OnRequestReceivedAsync)
        {
            _subscriberAsync = async (IMessage message) =>
            {
                ITextMessage msg = (ITextMessage)message;
                CSharpMsgRequest request = JsonConvert.DeserializeObject<CSharpMsgRequest>(msg.Text, _jsonSettins);
                await OnRequestReceivedAsync(request);
            };
            _consumer.Listener += _subscriberAsync;
        }

        public void Unsubscribe()
        {
            _consumer.Listener -= _subscriber;
            _subscriber = null;
        }

        public void UnsubscribeAsync()
        {
            _consumer.Listener -= _subscriberAsync;
            _subscriberAsync = null;
        }
    }
}
