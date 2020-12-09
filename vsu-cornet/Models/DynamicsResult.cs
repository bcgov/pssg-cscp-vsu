using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net;

namespace Gov.Cscp.Victims.Public.Models
{
	public class DynamicsResult
	{
		public HttpResponseMessage responseMessage { get; set; }
		public JObject result { get; set; }
		public HttpStatusCode statusCode { get; set; }
	}
}
