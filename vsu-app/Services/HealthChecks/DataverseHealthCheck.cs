using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.PowerPlatform.Dataverse.Client;

namespace Gov.Cscp.Victims.Public.Services.HealthChecks
{
    public class DataverseHealthCheck : IHealthCheck
    {
        private readonly IOrganizationServiceAsync _organizationService;

        public DataverseHealthCheck(IOrganizationServiceAsync organizationService)
        {
            _organizationService = organizationService;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default
        )
        {
            try
            {
                var response = (WhoAmIResponse)await _organizationService.ExecuteAsync(new WhoAmIRequest());

                return HealthCheckResult.Healthy($"Dataverse connection is healthy.");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Dataverse connection failed.", ex);
            }
        }
    }
}
