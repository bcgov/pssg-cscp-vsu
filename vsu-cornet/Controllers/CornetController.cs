using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;
using System;
using System.Collections;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class CornetController : Controller
    {
        private readonly ICornetResultService _cornetResultService;

        public CornetController(ICornetResultService dynamicsResultService)
        {
            this._cornetResultService = dynamicsResultService;
        }

        [HttpGet("clients")]
        public async Task<IActionResult> GetClients(string search_type, string surname, string given1, string given2,
        string birth_year, string birth_year_range, string gender, string identifier_type, string identifier_text,
        string username, string fullname, string client)
        {
            try
            {
                string endpointUrl = "clients";
                ArrayList search_parameters = new ArrayList();
                if (!string.IsNullOrEmpty(search_type))
                {
                    search_parameters.Add("search_type=" + search_type);
                }
                if (!string.IsNullOrEmpty(surname))
                {
                    search_parameters.Add("surname=" + surname);
                }
                if (!string.IsNullOrEmpty(given1))
                {
                    search_parameters.Add("given1=" + given1);
                }
                if (!string.IsNullOrEmpty(given2))
                {
                    search_parameters.Add("given2=" + given2);
                }
                if (!string.IsNullOrEmpty(birth_year))
                {
                    search_parameters.Add("birth_year=" + birth_year);
                }
                if (!string.IsNullOrEmpty(birth_year_range))
                {
                    search_parameters.Add("birth_year_range=" + birth_year_range);
                }
                if (!string.IsNullOrEmpty(gender))
                {
                    search_parameters.Add("gender=" + gender);
                }
                if (!string.IsNullOrEmpty(identifier_type))
                {
                    search_parameters.Add("identifier_type=" + identifier_type);
                }
                if (!string.IsNullOrEmpty(identifier_text))
                {
                    search_parameters.Add("identifier_text=" + identifier_text);
                }

                string parameters = String.Join("&", search_parameters.ToArray());

                if (!string.IsNullOrEmpty(parameters))
                {
                    endpointUrl += "?" + parameters;
                }

                Console.WriteLine(parameters);

                CornetHeaderInfo headers = new CornetHeaderInfo
                {
                    username = username,
                    fullname = fullname,
                    client = client
                };

                DynamicsResult result = await _cornetResultService.Get(endpointUrl, headers);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}