using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class CourtInfo
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.vsd_applicationcourtinformation"; } }
        public string vsd_courtfilenumber { get; set; }
        public string vsd_courtlocation { get; set; }
    }
}
