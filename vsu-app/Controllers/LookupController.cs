﻿using System.Threading.Tasks;
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
                _logger.Error(e, "Unexpected error while looking up countries in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up provinces in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up cities in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while searching cities in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up cities by country in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up cities by province in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up courts in COAST. Source = VSU");
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
                _logger.Error(e, "Unexpected error while looking up offences in COAST. Source = VSU");
                return BadRequest();
            }
            finally { }
        }

        [HttpGet("rates")]
        public async Task<IActionResult> GetMealRates()
        {
            try
            {
                //these ID's are completely static between all environments - so they get hardcoded in for loading the meal rates
                string breakfastId = "bbebd045-fd76-eb11-b823-00505683fbf4";
                string lunchId = "25934686-fd76-eb11-b823-00505683fbf4";
                string dinnerId = "89d4ae92-fd76-eb11-b823-00505683fbf4";
                string mileageId = "92351edf-2a7d-eb11-b824-00505683fbf4";

                string endpointUrl = $"vsd_configs?$select=vsd_value,vsd_key&$filter=statecode eq 0 and (vsd_configid eq {breakfastId} or vsd_configid eq {lunchId} or vsd_configid eq {dinnerId} or vsd_configid eq {mileageId})";
                DynamicsResult result = await _dynamicsResultService.Get(endpointUrl);
                return StatusCode((int)result.statusCode, result.result.ToString());
            }
            catch (Exception e)
            {
                _logger.Error(e, "Unexpected error while looking up offences in COAST. Source = VSU");
                return BadRequest();
            }
            finally { }
        }
    }
}
