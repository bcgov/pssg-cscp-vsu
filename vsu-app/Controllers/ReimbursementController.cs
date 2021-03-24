using Gov.Cscp.Victims.Public.Models;
using Gov.Cscp.Victims.Public.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Serilog;
using System.Text.Json;
using System.Threading.Tasks;
using System;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ReimbursementController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;
        private readonly ILogger _logger;

        public ReimbursementController(IConfiguration configuration, IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
            _logger = Log.Logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReimbursementInvoice([FromBody] ReimbursementData model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.Error($"API call to 'SubmitReimbursementInvoice' made with invalid model state. Error is:\n{ModelState}. Source = VSU");
                    return BadRequest(ModelState);
                }

                string endpointUrl = "vsd_SubmitReimbursementInvoice";
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.IgnoreNullValues = true;
                string modelString = System.Text.Json.JsonSerializer.Serialize(model, options);
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while submitting reimbursement. Source = VSU");
                return BadRequest();
            }
            finally { }
        }

        [HttpPost("check_case")]
        public async Task<IActionResult> CheckVSUCase([FromBody] CheckCase info)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.Error($"API call to 'CheckVSUCase' made with invalid model state. Error is:\n{ModelState}. Source = VSU");
                    return BadRequest(ModelState);
                }

                string endpointUrl = "vsd_CheckVSUCase";
                JsonSerializerOptions options = new JsonSerializerOptions();
                options.IgnoreNullValues = true;
                string modelString = System.Text.Json.JsonSerializer.Serialize(info, options);
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, modelString);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while checking VSU case. Source = VSU");
                return BadRequest();
            }
            finally { }
        }
    }
}
