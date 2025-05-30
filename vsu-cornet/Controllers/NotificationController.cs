using System.Threading.Tasks;
using Gov.Cscp.Victims.Public.Models;
using Gov.Cscp.Victims.Public.Services;
using Microsoft.AspNetCore.Mvc;

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
                string endpointUrl =
                    $"vsd_cornetnotifications?$filter=statecode eq 0 and vsd_clientnumber eq '{clientId}'";

                HttpClientResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
