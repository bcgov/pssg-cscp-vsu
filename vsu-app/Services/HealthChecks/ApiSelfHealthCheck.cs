using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Gov.Cscp.Victims.Public.Services.HealthChecks
{
    public class ApiSelfHealthCheck : IHealthCheck
    {
        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default
        )
        {
            return Task.FromResult(HealthCheckResult.Healthy("API is up and running."));
        }
    }
}
