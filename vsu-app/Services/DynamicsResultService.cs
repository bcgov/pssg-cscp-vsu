using Gov.Cscp.Victims.Public.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Rest;
using Serilog;
using System.Net.Http;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Services
{
    public interface IDynamicsResultService
    {
        Task<DynamicsResult> Get(string endpointUrl);
        Task<DynamicsResult> Post(string endpointUrl, string requestJson);
    }

    public class DynamicsResultService : IDynamicsResultService
    {
        private HttpClient _client;
        private IConfiguration _configuration;
        private readonly ILogger _logger;

        public DynamicsResultService(IConfiguration configuration, HttpClient httpClient)
        {
            _client = httpClient;
            _configuration = configuration;
            _logger = Log.Logger;
        }

        public async Task<DynamicsResult> Get(string endpointUrl)
        {
            DynamicsResult blob = await DynamicsResultAsync(HttpMethod.Get, endpointUrl, "");
            return blob;
        }

        public async Task<DynamicsResult> Post(string endpointUrl, string modelJson)
        {
            DynamicsResult blob = await DynamicsResultAsync(HttpMethod.Post, endpointUrl, modelJson);
            return blob;
        }

        private async Task<DynamicsResult> DynamicsResultAsync(HttpMethod method, string endpointUrl, string requestJson)
        {
            string fullEndpoint = _configuration["DYNAMICS_ODATA_URI"] + endpointUrl;
            requestJson = requestJson.Replace("fortunecookie", "@odata.");

            Console.WriteLine(fullEndpoint);
            Console.WriteLine(requestJson);

            HttpRequestMessage _httpRequest = new HttpRequestMessage(method, fullEndpoint);
            _httpRequest.Content = new StringContent(requestJson, System.Text.Encoding.UTF8, "application/json");

            HttpResponseMessage _httpResponse = await _client.SendAsync(_httpRequest);
            HttpStatusCode _statusCode = _httpResponse.StatusCode;

            string _responseContent = await _httpResponse.Content.ReadAsStringAsync();

            DynamicsResult result = new DynamicsResult();
            result.statusCode = _statusCode;
            result.responseMessage = _httpResponse;
            string clean = _responseContent.Replace("@odata.", "fortunecookie");
            result.result = Newtonsoft.Json.Linq.JObject.Parse(clean);

            if (result.result.ContainsKey("IsSuccess") && result.result["IsSuccess"].ToString().Equals("False"))
            {
                _logger.Information(new HttpOperationException($"Received a fail response from {endpointUrl}. Source = VSU"), $"Error calling API function {endpointUrl}. \nSource = VSU. \nError is:\n{result.result}\n\nJSON sent:{requestJson}", result.result, requestJson);
            }

            if (!(new HttpResponseMessage((HttpStatusCode)_statusCode).IsSuccessStatusCode))
            {
                _logger.Error(new HttpOperationException($"Error calling API function {endpointUrl}. Source = VSU"), $"Error calling API function {endpointUrl}. \nSource = VSU. \nError is:\n{result.result}\n\nJSON sent:{requestJson}", result.result, requestJson);
            }

            // Console.WriteLine(result.result);

            return result;
        }
    }
}