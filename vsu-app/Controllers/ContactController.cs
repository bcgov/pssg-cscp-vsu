using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public ContactController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact(string id)
        {
            try
            {
                string endpointUrl = $"contacts({id})";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}