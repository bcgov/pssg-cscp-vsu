using Gov.Cscp.Victims.Public.Models;
using Gov.Cscp.Victims.Public.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Rest;
using Serilog;
using Microsoft.Extensions.Configuration;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ApplicationController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;
        private readonly ILogger _logger;

        public ApplicationController(IConfiguration configuration, IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
            _logger = Log.Logger;
        }

        [HttpGet]
        public async Task<IActionResult> TestSplunk([FromBody] ApplicationData model)
        {
            try
            {
                _logger.Error(new HttpOperationException("Test splunk error message"), "Test splunk error message");
                return Ok();
            }
            finally { }
        }

        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] ApplicationData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                string endpointUrl = "vsd_CreateVSUCase";
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.IgnoreNullValues = true;
                string modelString = System.Text.Json.JsonSerializer.Serialize(model, options);
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (HttpOperationException httpOperationException)
            {
                _logger.Error(httpOperationException, "Unexpected error while submitting application");
                return BadRequest();
            }
            finally { }
        }
    }
}
