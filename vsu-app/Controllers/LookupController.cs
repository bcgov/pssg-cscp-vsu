using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class LookupController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;

        public LookupController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                // set the endpoint action
                string endpointUrl = "vsd_countries?$select=vsd_name&$filter=statecode eq 0";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            try
            {
                // set the endpoint action
                string endpointUrl = "vsd_provinces?$select=vsd_code,_vsd_countryid_value,vsd_name&$filter=statecode eq 0";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            try
            {
                // set the endpoint action
                string endpointUrl = "vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("cities/search")]
        public async Task<IActionResult> SearchCities(string country, string province, string searchVal, int limit)
        {
            try
            {
                string requestBody = "";
                if (!string.IsNullOrEmpty(country))
                {
                    requestBody += "\"Country\":\"" + country + "\",";
                }
                if (!string.IsNullOrEmpty(province))
                {
                    requestBody += "\"Province\":\"" + province + "\",";
                }
                if (!string.IsNullOrEmpty(searchVal))
                {
                    requestBody += "\"City\":\"" + searchVal + "\",";
                }
                requestBody += "\"TopCount\":" + limit + "";

                string requestJson = "{" + requestBody + "}";
                string endpointUrl = "vsd_GetCities";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, requestJson);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("country/{country}/cities")]
        public async Task<IActionResult> GetCitiesByCountry(string country)
        {
            try
            {
                string requestJson = "{\"Country\":\"" + country + "\"}";
                // set the endpoint action
                string endpointUrl = $"vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0 and _vsd_countryid_value eq {country}";
                // string endpointUrl = "vsd_GetCities";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("country/{countryId}/province/{provinceId}/cities")]
        public async Task<IActionResult> GetCitiesByProvince(string countryId, string provinceId)
        {
            try
            {
                // set the endpoint action
                string endpointUrl = $"vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0 and _vsd_countryid_value eq {countryId} and _vsd_stateid_value eq {provinceId}";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }

        [HttpGet("courts")]
        public async Task<IActionResult> GetCourts()
        {
            try
            {
                // set the endpoint action
                string endpointUrl = "vsd_courts?$select=vsd_name&$filter=statecode eq 0";

                // get the response
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);

                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            finally { }
        }
    }
}
