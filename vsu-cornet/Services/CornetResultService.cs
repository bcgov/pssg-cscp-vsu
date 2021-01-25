using Gov.Cscp.Victims.Public.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System;

namespace Gov.Cscp.Victims.Public.Services
{
    public class CornetHeaderInfo
    {
        public string username { get; set; }
        public string fullname { get; set; }
        public string client { get; set; }
    }


    public interface ICornetResultService
    {
        Task<HttpClientResult> Get(string endpointUrl, CornetHeaderInfo headers);
        Task<HttpClientResult> Post(string endpointUrl, string requestJson, CornetHeaderInfo headers);
    }

    public class CornetResultService : ICornetResultService
    {
        private HttpClient _client;
        private IConfiguration _configuration;

        public CornetResultService(IConfiguration configuration, HttpClient httpClient)
        {
            _client = httpClient;
            _configuration = configuration;
        }

        public async Task<HttpClientResult> Get(string endpointUrl, CornetHeaderInfo headers)
        {
            HttpClientResult blob = await CornetResultAsync(HttpMethod.Get, endpointUrl, "", headers);
            return blob;
        }

        public async Task<HttpClientResult> Post(string endpointUrl, string modelJson, CornetHeaderInfo headers)
        {
            HttpClientResult blob = await CornetResultAsync(HttpMethod.Post, endpointUrl, modelJson, headers);
            return blob;
        }

        private async Task<HttpClientResult> CornetResultAsync(HttpMethod method, string endpointUrl, string requestJson, CornetHeaderInfo headers)
        {
            endpointUrl = _configuration["CORNET_URI"] + endpointUrl;

            Console.WriteLine(endpointUrl);
            Console.WriteLine(requestJson);

            HttpRequestMessage _httpRequest = new HttpRequestMessage(method, endpointUrl);
            _httpRequest.Headers.Add("username", headers.username);
            _httpRequest.Headers.Add("fullname", headers.fullname);
            _httpRequest.Headers.Add("client", headers.client);
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
                result.result = Newtonsoft.Json.Linq.JObject.Parse(_responseContent);
            }

            Console.WriteLine(result.result);

            return result;
        }
    }
}