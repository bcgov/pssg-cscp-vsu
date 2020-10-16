using Gov.Cscp.Victims.Public.Models;
using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Services
{
    public interface IDynamicsResultService
    {
        Task<DynamicsResult> Get(string endpointUrl);
        Task<DynamicsResult> Post(string endpointUrl, string requestJson);
    }
}