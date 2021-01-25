using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class TravelInfo
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.vsd_travelinformation"; } }
        public string vsd_courtfilenumber_text { get; set; }
        public DateTime? vsd_courtdate { get; set; }
        public string vsd_purposeoftravel { get; set; }
        public DateTime? vsd_travelperiodfrom { get; set; }
        public DateTime? vsd_travelperiodto { get; set; }
    }
}
