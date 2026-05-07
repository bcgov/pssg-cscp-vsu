using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Microsoft.PowerPlatform.Dataverse.Client;

namespace Gov.Cscp.Victims.Public.Services.HealthChecks
{
    public class DataverseHealthCheck : IHealthCheck
    {
        private readonly IOrganizationServiceAsync _organizationService;
        private readonly ILogger<DataverseHealthCheck> _logger;

        public DataverseHealthCheck(IOrganizationServiceAsync organizationService, ILogger<DataverseHealthCheck> logger)
        {
            _organizationService = organizationService;
            _logger = logger;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default
        )
        {
            try
            {
                if (_organizationService is ServiceClient serviceClient && !serviceClient.IsReady)
                {
                    _logger.LogError(
                        "DataverseHealthCheck status={CheckStatus} description={CheckDescription}",
                        HealthStatus.Unhealthy,
                        "Dataverse ServiceClient is not ready."
                    );
                    return HealthCheckResult.Unhealthy("Dataverse ServiceClient is not ready.");
                }

                await _organizationService.ExecuteAsync(new WhoAmIRequest());

                return HealthCheckResult.Healthy("Dataverse connection is healthy.");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "DataverseHealthCheck status={CheckStatus} description={CheckDescription}",
                    HealthStatus.Unhealthy,
                    "Dataverse ServiceClient is not ready."
                );

                return HealthCheckResult.Unhealthy("Dataverse connection failed.", ex);
            }
        }
    }
}
