using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Models;
using Serilog;
using System;

namespace Gov.Cscp.Victims.Public.Controllers
{
    [Route("api/[controller]")]
    public class LookupController : Controller
    {
        private readonly IDynamicsResultService _dynamicsResultService;
        private readonly ILogger _logger;

        public LookupController(IDynamicsResultService dynamicsResultService)
        {
            this._dynamicsResultService = dynamicsResultService;
            _logger = Log.Logger;
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                string endpointUrl = "vsd_countries?$select=vsd_name&$filter=statecode eq 0";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up countries in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            try
            {
                string endpointUrl = "vsd_provinces?$select=vsd_code,_vsd_countryid_value,vsd_name&$filter=statecode eq 0";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up provinces in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            try
            {
                string endpointUrl = "vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up cities in COAST");
                return BadRequest();
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

                DynamicsResult result = await _dynamicsResultService.Post(endpointUrl, requestJson);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while searching cities in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("country/{country}/cities")]
        public async Task<IActionResult> GetCitiesByCountry(string country)
        {
            try
            {
                string requestJson = "{\"Country\":\"" + country + "\"}";
                string endpointUrl = $"vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0 and _vsd_countryid_value eq {country}";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up cities by country in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("country/{countryId}/province/{provinceId}/cities")]
        public async Task<IActionResult> GetCitiesByProvince(string countryId, string provinceId)
        {
            try
            {
                string endpointUrl = $"vsd_cities?$select=_vsd_countryid_value,vsd_name,_vsd_stateid_value&$filter=statecode eq 0 and _vsd_countryid_value eq {countryId} and _vsd_stateid_value eq {provinceId}";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up cities by province in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("courts")]
        public async Task<IActionResult> GetCourts()
        {
            try
            {
                string endpointUrl = "vsd_courts?$select=vsd_name&$filter=statecode eq 0";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up courts in COAST");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("offences")]
        public async Task<IActionResult> GetOffences()
        {
            try
            {
                string endpointUrl = "vsd_offenses?$select=vsd_name,vsd_offenseid,vsd_criminalcode&$filter=statecode eq 0 and vsd_vsu_travelfundoffences eq 100000001";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up offences in COAST");
                return BadRequest();
            }
            finally { }
        }
    }
}
