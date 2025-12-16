using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Participant
    {
        public string fortunecookietype
        {
            get { return "Microsoft.Dynamics.CRM.vsd_participant"; }
        }

        [StringLength(160)]
        public string vsd_firstname { get; set; }

        [StringLength(100)]
        [JsonConverter(typeof(EmptyStringToNullConverter))]
        public string? vsd_middlename { get; set; }

        [StringLength(100)]
        public string vsd_lastname { get; set; }

        [StringLength(100)]
        public string vsd_companyname { get; set; }

        [StringLength(400)]
        public string vsd_name { get; set; }
        public DateTime? vsd_birthdate { get; set; }
        public int? vsd_gender { get; set; }

        [StringLength(500)]
        [JsonConverter(typeof(EmptyStringToNullConverter))]
        public string? vsd_genderidentitytext { get; set; }
        public int? vsd_pronouns { get; set; }

        [StringLength(500)]
        [JsonConverter(typeof(EmptyStringToNullConverter))]
        public string? vsd_pronountext { get; set; }

        public int? vsd_primaryraceethnicity { get; set; }

        [StringLength(500)]
        [JsonConverter(typeof(EmptyStringToNullConverter))]
        public string? vsd_primaryraceethnicitytext { get; set; }

        [StringLength(250)]
        public string vsd_phonenumber { get; set; }

        [StringLength(100)]
        public string vsd_mainphoneextension { get; set; }

        [StringLength(250)]
        public string vsd_addressline1 { get; set; }

        [StringLength(250)]
        public string vsd_addressline2 { get; set; }

        [StringLength(100)]
        public string vsd_city { get; set; }

        [StringLength(100)]
        public string vsd_province { get; set; }

        [StringLength(20)]
        public string vsd_postalcode { get; set; }
        public int? vsd_vsu_oktosendmail { get; set; }

        [StringLength(100)]
        public string vsd_email { get; set; }

        [StringLength(150)]
        public string vsd_relationship1 { get; set; }

        [StringLength(100)]
        public string vsd_relationship1other { get; set; }

        [StringLength(150)]
        public string vsd_relationship2 { get; set; }

        [StringLength(100)]
        public string vsd_relationship2other { get; set; }
        public int? vsd_vsu_methodofcontact1type { get; set; }

        [StringLength(100)]
        public string vsd_vsu_methodofcontact1number { get; set; }

        [StringLength(100)]
        public string vsd_vsu_methodofcontact1ext { get; set; }
        public int? vsd_vsu_methodofcontact1leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact2type { get; set; }

        [StringLength(100)]
        public string vsd_vsu_methodofcontact2number { get; set; }
        public int? vsd_vsu_methodofcontact2leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact3type { get; set; }

        [StringLength(100)]
        public string vsd_vsu_methodofcontact3number { get; set; }
        public int? vsd_vsu_methodofcontact3leavedetailedmessage { get; set; }
    }
}
