using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Participant
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.vsd_participant"; } }
        public string vsd_firstname { get; set; }
        public string vsd_middlename { get; set; }
        public string vsd_lastname { get; set; }
        public string vsd_companyname { get; set; }
        public string vsd_name { get; set; }
        public DateTime? vsd_birthdate { get; set; }
        public int? vsd_gender { get; set; }
        public string vsd_phonenumber { get; set; }
        public string vsd_mainphoneextension { get; set; }
        public string vsd_addressline1 { get; set; }
        public string vsd_addressline2 { get; set; }
        public string vsd_city { get; set; }
        public string vsd_province { get; set; }
        public string vsd_postalcode { get; set; }
        public int? vsd_vsu_oktosendmail { get; set; }
        public string vsd_email { get; set; }
        public string vsd_relationship1 { get; set; }
        public string vsd_relationship1other { get; set; }
        public string vsd_relationship2 { get; set; }
        public string vsd_relationship2other { get; set; }

        public int? vsd_vsu_methodofcontact1type { get; set; }
        public string vsd_vsu_methodofcontact1number { get; set; }
        public int? vsd_vsu_methodofcontact1leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact2type { get; set; }
        public string vsd_vsu_methodofcontact2number { get; set; }
        public int? vsd_vsu_methodofcontact2leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact3type { get; set; }
        public string vsd_vsu_methodofcontact3number { get; set; }
        public int? vsd_vsu_methodofcontact3leavedetailedmessage { get; set; }
    }
}
