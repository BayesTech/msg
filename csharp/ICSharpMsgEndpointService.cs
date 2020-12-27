using System.Threading.Tasks;

namespace CSharpMsg
{
    public interface ICSharpMsgEndpointService
    {
        string Route { get; }
        CSharpMsgRequestMethod RequestMethod { get; }
        string Key { get; }

        void Process(CSharpMsgRequest request);
        Task ProcessAsync(CSharpMsgRequest request);
    }
}