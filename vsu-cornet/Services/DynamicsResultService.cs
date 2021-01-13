using Gov.Cscp.Victims.Public.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System;

namespace Gov.Cscp.Victims.Public.Services
{
    public interface IDynamicsResultService
    {
        Task<HttpClientResult> Get(string endpointUrl);
        Task<HttpClientResult> Post(string endpointUrl, string requestJson);
    }

    public class DynamicsResultService : IDynamicsResultService
    {
        private HttpClient _client;
        private IConfiguration _configuration;

        public DynamicsResultService(IConfiguration configuration, HttpClient httpClient)
        {
            _client = httpClient;
            _configuration = configuration;
        }

        public async Task<HttpClientResult> Get(string endpointUrl)
        {
            HttpClientResult blob = await DynamicsResultAsync(HttpMethod.Get, endpointUrl, "");
            return blob;
        }

        public async Task<HttpClientResult> Post(string endpointUrl, string modelJson)
        {
            HttpClientResult blob = await DynamicsResultAsync(HttpMethod.Post, endpointUrl, modelJson);
            return blob;
        }

        private async Task<HttpClientResult> DynamicsResultAsync(HttpMethod method, string endpointUrl, string requestJson)
        {
            endpointUrl = _configuration["DYNAMICS_ODATA_URI"] + endpointUrl;
            requestJson = requestJson.Replace("fortunecookie", "@odata.");

            Console.WriteLine(endpointUrl);
            Console.WriteLine(requestJson);

            HttpRequestMessage _httpRequest = new HttpRequestMessage(method, endpointUrl);
            _httpRequest.Content = new StringContent(requestJson, System.Text.Encoding.UTF8, "application/json");

            HttpResponseMessage _httpResponse = await _client.SendAsync(_httpRequest);
            HttpStatusCode _statusCode = _httpResponse.StatusCode;

            string _responseContent = await _httpResponse.Content.ReadAsStringAsync();

            HttpClientResult result = new HttpClientResult();
            result.statusCode = _statusCode;
            result.responseMessage = _httpResponse;
            result.result = new Newtonsoft.Json.Linq.JObject();
            if (_statusCode == HttpStatusCode.OK)
            {
                string clean = _responseContent.Replace("@odata.", "fortunecookie");
                result.result = Newtonsoft.Json.Linq.JObject.Parse(clean);
            }

            Console.WriteLine(result.result);

            return result;
        }
    }
}