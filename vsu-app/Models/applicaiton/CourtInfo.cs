using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class CourtInfo
    {
        public string fortunecookietype
        {
            get { return "Microsoft.Dynamics.CRM.vsd_applicationcourtinformation"; }
        }

        [StringLength(100)]
        public string vsd_courtfilenumber { get; set; }

        [StringLength(100)]
        public string vsd_courtlocation { get; set; }
    }
}
