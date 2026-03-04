using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class ApplicationDto
    {
        public int ApplicationType { get; set; }

        [StringLength(100)]
        public string VictimFirstName { get; set; }

        [StringLength(100)]
        public string VictimMiddleName { get; set; }

        [StringLength(100)]
        public string VictimLastName { get; set; }
        public DateTime? VictimBirthDate { get; set; }

        [StringLength(100)]
        public string vsd_otherfirstname { get; set; }

        [StringLength(100)]
        public string vsd_otherlastname { get; set; }
        public DateTime? vsd_dateofnamechange { get; set; }
        public int? VictimGenderCode { get; set; }

        [StringLength(500)]
        public string vsd_victimgendertext { get; set; }
        public int? vsd_victimpronouns { get; set; }

        [StringLength(500)]
        public string vsd_victimpronountext { get; set; }

        public int? vsd_victimprimaryraceethnicity { get; set; }

        [StringLength(500)]
        public string vsd_victimprimaryraceethnicitytext { get; set; }
        public int? vsd_victimindigenous { get; set; }

        public int vsd_vsu_applicanttype { get; set; }

        [StringLength(100)]
        public string vsd_vsu_applicanttypeother { get; set; }

        [StringLength(500)]
        public string vsd_vsu_offencescomments { get; set; }
        public int? vsd_vsu_decision1impacttooutcome { get; set; }

        [StringLength(500)]
        public string vsd_vsu_decision1comments { get; set; }
        public int? vsd_vsu_decision2travelover100km { get; set; }

        [StringLength(500)]
        public string vsd_vsu_decision2comments { get; set; }
        public int? vsd_vsu_decision3nootherfundingsource { get; set; }

        [StringLength(500)]
        public string vsd_vsu_decision3comments { get; set; }

        [StringLength(500)]
        public string vsd_vsu_additionalcomments { get; set; }

        [StringLength(100)]
        public string RelationshipToVictim { get; set; }
        public int? VictimTravelFundApplicationSubmitted { get; set; }

        [StringLength(100)]
        public string vsd_vsu_vtfappsubmittedunknowncomments { get; set; }
        public int? vsd_vsu_otherfamilymembersapplyingtovtf { get; set; }

        [StringLength(100)]
        public string vsd_vsu_otherfamilymembersvtfothercomments { get; set; }

        public string vsd_vsu_vswcomments { get; set; }

        public int? vsd_vsu_costscoveredbyvsp { get; set; }

        [StringLength(500)]
        public string vsd_vsu_vspcomments { get; set; }

        [StringLength(250)]
        public string vsd_vsu_managerfirstname { get; set; }

        [StringLength(250)]
        public string vsd_vsu_managerlastname { get; set; }

        [StringLength(250)]
        public string vsd_vsu_organizationagencyname { get; set; }

        [StringLength(100)]
        public string vsd_vsu_managerphone { get; set; }

        [StringLength(100)]
        public string vsd_vsu_manageremail { get; set; }

        [StringLength(100)]
        public string vsd_applicantsfirstname { get; set; }

        [StringLength(100)]
        public string vsd_applicantsmiddlename { get; set; }

        [StringLength(100)]
        public string vsd_applicantslastname { get; set; }
        public int? vsd_applicantsmaritalstatus { get; set; }
        public int? vsd_applicantsgendercode { get; set; }

        [StringLength(100)]
        public string vsd_genderidentitytext { get; set; }
        public int? vsd_pronouns { get; set; }

        [StringLength(100)]
        public string vsd_pronountext { get; set; }

        public DateTime? vsd_applicantsbirthdate { get; set; }
        public int? vsd_primaryraceethnicity { get; set; }

        [StringLength(500)]
        public string vsd_primaryraceethnicitytext { get; set; }
        public int? vsd_indigenous { get; set; }

        [StringLength(100)]
        public string vsd_applicantspreferredlanguage { get; set; }
        public int? vsd_applicantsinterpreterneeded { get; set; }

        [StringLength(250)]
        public string vsd_applicantsprimaryaddressline1 { get; set; }

        [StringLength(250)]
        public string vsd_applicantsprimaryaddressline2 { get; set; }

        [StringLength(100)]
        public string vsd_applicantsprimarycity { get; set; }

        [StringLength(100)]
        public string vsd_applicantsprimaryprovince { get; set; }

        [StringLength(100)]
        public string vsd_applicantsprimarycountry { get; set; }

        [StringLength(20)]
        public string vsd_applicantsprimarypostalcode { get; set; }
        public int? vsd_vsu_oktosendmail { get; set; }
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
        public int? vsd_vsu_notificationto { get; set; }
        public int? vsd_vsu_discussvtfappwithvsp { get; set; }

        public int? vsd_vsu_significantcourtupdates { get; set; }
        public int? vsd_vsu_finalcourtresults { get; set; }
        public int? vsd_vsu_updatesonallcriminalcourtappearances { get; set; }
        public int? vsd_vsu_criminalcourtordersissued { get; set; }
        public int? vsd_vsu_bccorrectionsinformation { get; set; }

        [StringLength(250)]
        public string vsd_vsu_notificationadditionalcomments { get; set; }

        public string vsd_vsu_travelexpenserequest_03 { get; set; }

        [StringLength(100)]
        public string vsd_vsu_travelexpenserequesttransportother { get; set; }

        [StringLength(100)]
        public string vsd_vsu_travelexpenserequestother { get; set; }
        public string vsd_vsu_purposeoftravel { get; set; }
        public DateTime? vsd_vsu_travelperiodfrom { get; set; }
        public DateTime? vsd_vsu_travelperiodto { get; set; }

        [StringLength(250)]
        public string vsd_vsu_additionaltravelcomments { get; set; }

        public int? vsd_vsu_infosharecscpbc { get; set; }
        public int? vsd_vsu_infosharevsu { get; set; }
        public int? vsd_vsu_infosharevsw { get; set; }
        public int? vsd_declarationverified { get; set; }

        [StringLength(150)]
        public string vsd_declarationfullname { get; set; }
        public DateTime? vsd_declarationdate { get; set; }
        public string vsd_applicantssignature { get; set; }
    }
}
