using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;
using System.Text.Json;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class OffenderController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public OffenderController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpGet("{offenderId}")]
        public async Task<IActionResult> GetOffendyById(string offenderId)
        {
            try
            {
                string endpointUrl = $"vsd_offenders?$filter=vsd_offenderid eq {offenderId}";

                HttpClientResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("cs-number/{cs}")]
        public async Task<IActionResult> GetOffendyByCSNumber(string cs)
        {
            try
            {
                string endpointUrl = $"vsd_offenders?$filter=statecode eq 0 and vsd_csnumber eq '{cs}'";

                HttpClientResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffender([FromBody] Offender model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                string endpointUrl = $"vsd_offenders";

                JsonSerializerOptions options = new JsonSerializerOptions();
                options.IgnoreNullValues = true;
                string modelString = System.Text.Json.JsonSerializer.Serialize(model, options);
                HttpClientResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
