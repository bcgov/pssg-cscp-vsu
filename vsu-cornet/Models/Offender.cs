using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Offender
    {
        public string vsd_firstname { get; set; }
        public string vsd_lastname { get; set; }
        public string vsd_csnumber { get; set; }
        public DateTime? vsd_birthdate { get; set; }
        public int vsd_gender { get; set; }
    }
}
