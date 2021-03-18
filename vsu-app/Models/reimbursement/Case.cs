using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Case
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.incident"; } }
        public string incidentid { get; set; }
        public DateTime? vsd_courtdate { get; set; }
        public string vsd_purposeoftravel { get; set; }
        public DateTime? vsd_travelperiodfrom { get; set; }
        public DateTime? vsd_travelperiodto { get; set; }
    }
}
