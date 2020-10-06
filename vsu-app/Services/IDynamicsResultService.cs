using Gov.Cscp.Victims.Public.Models;
using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Services
{
	public interface IDynamicsResultService
	{
		Task<DynamicsResult> Get(string endpointUrl);
		Task<DynamicsResult> GetResultAsync(string endpointUrl, string requestJson);
		Task<DynamicsResult> SetDataAsync(string endpointUrl, string requestJson);
	}
}