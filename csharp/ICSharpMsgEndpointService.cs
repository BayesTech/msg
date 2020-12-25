using System.Threading.Tasks;

namespace csharp_msg
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