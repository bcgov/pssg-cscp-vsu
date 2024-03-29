using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Application
    {
        public string fortunecookietype { get { return "Microsoft.Dynamics.CRM.vsd_application"; } }
        public int vsd_vsu_applicationtype { get; set; }
        public string vsd_cvap_victimfirstname { get; set; }
        public string vsd_cvap_victimmiddlename { get; set; }
        public string vsd_cvap_victimlastname { get; set; }
        public DateTime? vsd_cvap_victimbirthdate { get; set; }
        public int? vsd_cvap_victimgendercode { get; set; }

        public int vsd_vsu_applicanttype { get; set; }
        public string vsd_vsuapplicanttypeother { get; set; }

        public string vsd_vsu_offencescomments { get; set; }
        public int? vsd_vsu_decision1impacttooutcome { get; set; }
        public string vsd_vsu_decision1comments { get; set; }
        public int? vsd_vsu_decision2travelover100km { get; set; }
        public string vsd_vsu_decision2comments { get; set; }
        public int? vsd_vsu_decision3nootherfundingsource { get; set; }
        public string vsd_vsu_decision3comments { get; set; }
        public string vsd_vsu_additionalcomments { get; set; }

        public string vsd_cvap_relationshiptovictim { get; set; }
        public int? vsd_vsu_victimtravelfundapplicationsubmitted { get; set; }
        public string vsd_vsu_vtfappsubmittedunknowncomments { get; set; }
        public int? vsd_vsu_otherfamilymembersapplyingtovtf { get; set; }
        public string vsd_vsu_otherfamilymembersvtfothercomments { get; set; }

        public string vsd_vsu_vswcomments { get; set; }

        public int? vsd_vsu_costscoveredbyvsp { get; set; }
        public string vsd_vsu_vspcomments { get; set; }

        public string vsd_vsu_managerfirstname { get; set; }
        public string vsd_vsu_managerlastname { get; set; }
        public string vsd_vsu_organizationagencyname { get; set; }
        public string vsd_vsu_managerphone { get; set; }
        public string vsd_vsu_manageremail { get; set; }

        public string vsd_applicantsfirstname { get; set; }
        public string vsd_applicantsmiddlename { get; set; }
        public string vsd_applicantslastname { get; set; }
        public int? vsd_applicantsgendercode { get; set; }
        public DateTime? vsd_applicantsbirthdate { get; set; }
        public int? vsd_indigenous { get; set; }

        public string vsd_applicantspreferredlanguage { get; set; }
        public int? vsd_applicantsinterpreterneeded { get; set; }
        public string vsd_applicantsprimaryaddressline1 { get; set; }
        public string vsd_applicantsprimaryaddressline2 { get; set; }
        public string vsd_applicantsprimarycity { get; set; }
        public string vsd_applicantsprimaryprovince { get; set; }
        public string vsd_applicantsprimarycountry { get; set; }
        public string vsd_applicantsprimarypostalcode { get; set; }
        public int? vsd_vsu_oktosendmail { get; set; }
        public int? vsd_vsu_methodofcontact1type { get; set; }
        public string vsd_vsu_methodofcontact1number { get; set; }
        public string vsd_vsu_methodofcontact1ext { get; set; }
        public int? vsd_vsu_methodofcontact1leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact2type { get; set; }
        public string vsd_vsu_methodofcontact2number { get; set; }
        public int? vsd_vsu_methodofcontact2leavedetailedmessage { get; set; }
        public int? vsd_vsu_methodofcontact3type { get; set; }
        public string vsd_vsu_methodofcontact3number { get; set; }
        public int? vsd_vsu_methodofcontact3leavedetailedmessage { get; set; }
        public int? vsd_vsu_notificationto { get; set; }
        public int? vsd_vsu_discussvtfappwithvsp { get; set; }

        public int? vsd_vsu_significantcourtupdates { get; set; }
        public int? vsd_vsu_finalcourtresults { get; set; }
        public int? vsd_vsu_updatesonallcriminalcourtappearances { get; set; }
        public int? vsd_vsu_criminalcourtordersissued { get; set; }
        public int? vsd_vsu_bccorrectionsinformation { get; set; }
        public string vsd_vsu_notificationadditionalcomments { get; set; }

        public string vsd_vsu_travelexpenserequest_03 { get; set; }
        public string vsd_vsu_travelexpenserequesttransportother { get; set; }
        public string vsd_vsu_travelexpenserequestother { get; set; }
        public string vsd_vsu_purposeoftravel { get; set; }
        public DateTime? vsd_vsu_travelperiodfrom { get; set; }
        public DateTime? vsd_vsu_travelperiodto { get; set; }
        public string vsd_vsu_additionaltravelcomments { get; set; }

        public int? vsd_vsu_infosharecscpbc { get; set; }
        public int? vsd_vsu_infosharevsu { get; set; }
        public int? vsd_vsu_infosharevsw { get; set; }
        public int? vsd_declarationverified { get; set; }

        public string vsd_declarationfullname { get; set; }
        public DateTime? vsd_declarationdate { get; set; }
        public string vsd_applicantssignature { get; set; }
    }
}
