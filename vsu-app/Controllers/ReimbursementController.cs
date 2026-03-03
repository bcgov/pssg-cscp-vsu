using System;
using System.Threading.Tasks;
using DataverseModel;
using Gov.Cscp.Victims.Public.Models.Mapping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Models;
using Serilog;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ReimbursementController : Controller
    {
        private readonly IOrganizationServiceAsync _organizationService;
        private readonly ILogger _logger;

        public ReimbursementController(IOrganizationServiceAsync organizationService)
        {
            _organizationService = organizationService;
            _logger = Log.Logger;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReimbursementInvoice([FromBody] ReimbursementCaseDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.Error(
                        $"API call to 'SubmitReimbursementInvoice' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                    );
                    return BadRequest(ModelState);
                }

                // Map DTO to Dataverse request
                var request = model.ToVSdSubmitReimbursementInvoiceRequest();

                // Execute the request using Dataverse SDK
                var response = (VSd_SubmitReimbursementInvoiceResponse)await _organizationService.ExecuteAsync(request);

                if (response.Results["IsSuccess"] is not true)
                {
                    _logger.Error(
                        "Error while submitting reimbursement invoice. Response from Dynamics was:\n{@Response}",
                        response
                    );

                    return StatusCode(500, "An error occurred while submitting the reimbursement invoice.");
                }

                return Ok(response);
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while submitting reimbursement.");
                return StatusCode(500, "An unexpected error occurred while submitting the reimbursement.");
            }
            finally { }
        }

        [HttpPost("check_case")]
        public async Task<IActionResult> CheckVSUCase([FromBody] CheckCaseDto info)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.Error(
                        $"API call to 'CheckVSUCase' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                    );
                    return BadRequest(ModelState);
                }

                var request = info.ToVSdCheckVSuCaseRequest();

                var response = (VSd_CheckVSuCaseResponse)await _organizationService.ExecuteAsync(request);

                if (response.Results["IsSuccess"] is not true)
                {
                    return Ok(new { IsSuccess = false, Message = "No matching VSU case found." });
                }

                return Ok(new { IsSuccess = true, CaseId = response.CaseId.Id });
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while checking VSU case.");
                return StatusCode(500, "An unexpected error occurred while checking the VSU case.");
            }
            finally { }
        }
    }
}
