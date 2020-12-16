using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public NotificationController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetNotificationsForClient(string clientId)
        {
            try
            {
                string endpointUrl = $"vsd_cornetnotifications?$filter=statecode eq 0 and vsd_clientnumber eq '{clientId}'";

                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
