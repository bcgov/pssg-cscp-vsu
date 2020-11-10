using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Application
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.vsd_application"; } }

        public string vsd_cvap_victimfirstname { get; set; }
        public string vsd_cvap_victimmiddlename { get; set; }
        public string vsd_cvap_victimlastname { get; set; }
        public DateTime? vsd_cvap_victimbirthdate { get; set; }
        public int vsd_cvap_victimgendercode { get; set; }

        public int vsd_applicanttype { get; set; }
        public string vsd_applicantsfirstname { get; set; }
        public string vsd_applicantsmiddlename { get; set; }
        public string vsd_applicantslastname { get; set; }
        public int vsd_applicantsgendercode { get; set; }
        public DateTime? vsd_applicantsbirthdate { get; set; }

        public int? vsd_applicantsmaritalstatus { get; set; }
        public string vsd_applicantspreferredlanguage { get; set; }
        public int? vsd_applicantsinterpreterneeded { get; set; }
        public string vsd_applicantsprimaryaddressline1 { get; set; }
        public string vsd_applicantsprimaryaddressline2 { get; set; }
        public string vsd_applicantsprimarycity { get; set; }
        public string vsd_applicantsprimaryprovince { get; set; }
        public string vsd_applicantsprimarycountry { get; set; }
        public string vsd_applicantsprimarypostalcode { get; set; }
        public int? vsd_vsu_methodofcontact1type { get; set; }
        public string vsd_vsu_methodofcontact1number { get; set; }
        public int? vsd_vsu_methodofcontact1leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact2type { get; set; }
        public string vsd_vsu_methodofcontact2number { get; set; }
        public int? vsd_vsu_methodofcontact2leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact3type { get; set; }
        public string vsd_vsu_methodofcontact3number { get; set; }
        public int? vsd_vsu_methodofcontact3leavedetailedmessage { get; set; }
        public int? vsd_vsu_notificationto { get; set; }

        public int? vsd_vsu_significantcourtupdates { get; set; }
        public int? vsd_vsu_finalcourtresults { get; set; }
        public int? vsd_vsu_updatesonallcriminalcourtappearances { get; set; }
        public int? vsd_vsu_criminalcourtordersissued { get; set; }
        public int? vsd_vsu_bccorrectionsinformation { get; set; }

        public int? vsd_vsu_infosharecscpbc { get; set; }
        public int? vsd_vsu_infosharevsu { get; set; }
        public int? vsd_vsu_infosharevsw { get; set; }
        public int? vsd_declarationverified { get; set; }

        public string vsd_declarationfullname { get; set; }
        public DateTime? vsd_declarationdate { get; set; }
        public string vsd_applicantssignature { get; set; }
    }
}
