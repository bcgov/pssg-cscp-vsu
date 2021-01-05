using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class CaseController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public CaseController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpGet("case-number/{caseNumber}")]
        public async Task<IActionResult> GetCaseByCaseNumber(string caseNumber)
        {
            try
            {
                string endpointUrl = $"incidents?$select=_customerid_value&$filter=statecode eq 0 and ticketnumber eq '{caseNumber}'";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}