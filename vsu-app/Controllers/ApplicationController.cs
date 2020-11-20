using Gov.Cscp.Victims.Public.Models;
using Gov.Cscp.Victims.Public.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ApplicationController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public ApplicationController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] ApplicationData model)
        {
            try
            {
                string endpointUrl = "vsd_CreateVSUCase";
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.IgnoreNullValues = true;
                string modelString = System.Text.Json.JsonSerializer.Serialize(model, options);
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
