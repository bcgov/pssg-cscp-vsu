using System.Net.Http;
using System.Threading.Tasks;
using System.Threading;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using System;

namespace Gov.Cscp.Victims.Public.Services
{
    public class CornetAuthHandler : DelegatingHandler
    {
        private IConfiguration _configuration;

        public CornetAuthHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string username = _configuration["CORNET_USERNAME"];
            string password = _configuration["CORNET_PASSWORD"];

            string basicAuth = Convert.ToBase64String(
                        System.Text.ASCIIEncoding.ASCII.GetBytes(
                        $"{username}:{password}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", basicAuth);
            return await base.SendAsync(request, cancellationToken);
        }
    }
}
