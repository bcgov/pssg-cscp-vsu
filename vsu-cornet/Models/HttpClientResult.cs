using System.Net;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace Gov.Cscp.Victims.Public.Models
{
    public class HttpClientResult
    {
        public HttpResponseMessage responseMessage { get; set; }
        public JObject result { get; set; }
        public HttpStatusCode statusCode { get; set; }
    }
}
