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

        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromBody] ApplicationDataDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.Error(
                        $"API call to 'SubmitApplication' made with invalid model state. Error is:\n{ModelState}. Source = VSU"
                    );
                    return BadRequest(ModelState);
                }

                // Map DTO to Dataverse request
                var request = model.ToVSdCreateVSuCaseRequest();

                // Execute the request using Dataverse SDK
                var response = (VSd_CreateVSuCaseResponse)await _organizationService.ExecuteAsync(request);

                if (response.IsSuccess is not true)
                {
                    _logger.Error(
                        "Error while submitting application. Response from Dynamics was:\n{@Response}",
                        response
                    );

                    return StatusCode(500, "An error occurred while submitting the application.");
                }

                return Ok(new { IsSuccess = true, Result = response.Result });
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while submitting application. Source = VSU");
                return StatusCode(500, "An unexpected error occurred while submitting the application.");
            }
            finally { }
        }
    }
}
