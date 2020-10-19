using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net;

namespace Gov.Cscp.Victims.Public.Models
{
	public class DynamicsResult
	{
		// this just holds whatever was returned without casting it.
		public HttpResponseMessage responseMessage { get; set; }
		public JObject result { get; set; }
		public HttpStatusCode statusCode { get; set; }
	}
}
