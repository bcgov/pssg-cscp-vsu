using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class NotificationApplicationController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public NotificationApplicationController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] NotificationApplication model)
        {
            try
            {
                string endpointUrl = "vsu_SetApplication";
                string modelString = System.Text.Json.JsonSerializer.Serialize(model);
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
