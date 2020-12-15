using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

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

        [HttpGet("cs-number/{cs}")]
        public async Task<IActionResult> GetOffendyByCSNumber(string cs)
        {
            try
            {
                string endpointUrl = $"vsd_offenders?$filter=statecode eq 0 and vsd_csnumber eq '{cs}'";

                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
