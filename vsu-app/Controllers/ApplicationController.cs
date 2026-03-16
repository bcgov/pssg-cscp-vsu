using System;
using System.Threading.Tasks;
using DataverseModel;
using Gov.Cscp.Victims.Public.Models;
using Gov.Cscp.Victims.Public.Models.Mapping;
using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Serilog;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class ApplicationController : Controller
    {
        private readonly IOrganizationServiceAsync _organizationService;
        private readonly ILogger _logger;

        public ApplicationController(IOrganizationServiceAsync organizationService)
        {
            _organizationService = organizationService;
            _logger = Log.Logger;
        }

        [HttpPost("notification")]
        public async Task<IActionResult> SubmitNotificationApplication([FromBody] NotificationApplicationDataDto model)
        {
            if (!ModelState.IsValid)
            {
                _logger.Error(
                    $"API call to 'SubmitNotificationApplication' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                );
                return BadRequest(ModelState);
            }

            return await ExecuteSubmitApplication(model.ToVSdCreateVSuCaseRequest(), "SubmitNotificationApplication");
        }

        [HttpPost("vtf")]
        public async Task<IActionResult> SubmitVtfApplication([FromBody] VtfApplicationDataDto model)
        {
            if (!ModelState.IsValid)
            {
                _logger.Error(
                    $"API call to 'SubmitVtfApplication' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                );
                return BadRequest(ModelState);
            }

            return await ExecuteSubmitApplication(model.ToVSdCreateVSuCaseRequest(), "SubmitVtfApplication");
        }

        [HttpPost("vtf-reimbursement")]
        public async Task<IActionResult> SubmitVtfReimbursementApplication(
            [FromBody] VtfReimbursementApplicationDataDto model
        )
        {
            if (!ModelState.IsValid)
            {
                _logger.Error(
                    $"API call to 'SubmitVtfReimbursementApplication' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                );
                return BadRequest(ModelState);
            }

            return await ExecuteSubmitApplication(
                model.ToVSdCreateVSuCaseRequest(),
                "SubmitVtfReimbursementApplication"
            );
        }

        private async Task<IActionResult> ExecuteSubmitApplication(VSd_CreateVSuCaseRequest request, string actionName)
        {
            try
            {
                var response = (VSd_CreateVSuCaseResponse)await _organizationService.ExecuteAsync(request);

                if (response.IsSuccess is not true)
                {
                    _logger.Error(
                        "Error while submitting application via '{ActionName}'. Response from Dynamics was:\n{@Response}",
                        actionName,
                        response
                    );

                    return StatusCode(500, "An error occurred while submitting the application.");
                }

                return Ok(new { IsSuccess = true, Result = response.Result });
            }
            catch (Exception e)
            {
                _logger.Error(
                    e,
                    "Unexpected error while submitting application via '{ActionName}'. Source = VSU",
                    actionName
                );
                return StatusCode(500, "An unexpected error occurred while submitting the application.");
            }
        }
    }
}
