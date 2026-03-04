using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class ApplicationDto
    {
        public int ApplicationType { get; set; }

        [Required]
        [StringLength(100)]
        public string VictimFirstName { get; set; }

        [StringLength(100)]
        public string VictimMiddleName { get; set; }

        [Required]
        [StringLength(100)]
        public string VictimLastName { get; set; }

        [Required]
        public DateTime? VictimBirthDate { get; set; }

        [StringLength(100)]
        public string OtherFirstname { get; set; }

        [StringLength(100)]
        public string OtherLastname { get; set; }

        public DateTime? DateOfNameChange { get; set; }

        public int? VictimGenderCode { get; set; }

        [StringLength(500)]
        public string VictimGenderText { get; set; }

        public int? VictimPronouns { get; set; }

        [StringLength(500)]
        public string VictimPronounText { get; set; }

        public int? VictimPrimaryRaceEthnicity { get; set; }

        [StringLength(500)]
        public string VictimPrimaryRaceEthnicityText { get; set; }
        public int? VictimIndigenous { get; set; }

        [Required]
        public int? ApplicantType { get; set; }

        [StringLength(100)]
        public string ApplicantTypeOther { get; set; }

        [StringLength(500)]
        public string OffencesComments { get; set; }

        [Required]
        public int? Decision1ImpactToOutcome { get; set; }

        [StringLength(500)]
        public string Decision1Comments { get; set; }

        [Required]
        public int? Decision2TravelOver100KM { get; set; }

        [StringLength(500)]
        public string Decision2Comments { get; set; }

        [Required]
        public int? Decision3NoOtherFundingSource { get; set; }

        [StringLength(500)]
        public string Decision3Comments { get; set; }

        [StringLength(500)]
        public string AdditionalComments { get; set; }

        [StringLength(100)]
        public string RelationshipToVictim { get; set; }
        public int? VictimTravelFundApplicationSubmitted { get; set; }

        [StringLength(100)]
        public string VictimTravelFundApplicationSubmittedUnknownComments { get; set; }
        public int? OtherFamilyMembersApplyingToVTF { get; set; }

        [StringLength(100)]
        public string OtherFamilyMembersVTFOtherComments { get; set; }

        public string VSWComments { get; set; }

        public int? CostsCoveredByVSP { get; set; }

        [StringLength(500)]
        public string VSPComments { get; set; }

        [StringLength(250)]
        public string ManagerFirstName { get; set; }

        [StringLength(250)]
        public string ManagerLastName { get; set; }

        [StringLength(250)]
        public string OrganizationAgencyName { get; set; }

        [StringLength(100)]
        public string ManagerPhone { get; set; }

        [StringLength(100)]
        public string ManagerEmail { get; set; }

        [Required]
        [StringLength(100)]
        public string ApplicantsFirstName { get; set; }

        [StringLength(100)]
        public string ApplicantsMiddleName { get; set; }

        [Required]
        [StringLength(100)]
        public string ApplicantsLastName { get; set; }
        public int? ApplicantsMaritalStatus { get; set; }
        public int? ApplicantsGenderCode { get; set; }

        [StringLength(100)]
        public string ApplicantsGenderIdentityText { get; set; }
        public int? ApplicantsPronouns { get; set; }

        [StringLength(100)]
        public string ApplicantsPronounText { get; set; }

        [Required]
        public DateTime? ApplicantsBirthDate { get; set; }
        public int? ApplicantsPrimaryRaceEthnicity { get; set; }

        [StringLength(500)]
        public string ApplicantsPrimaryRaceEthnicityText { get; set; }
        public int? ApplicantsIndigenous { get; set; }

        [StringLength(100)]
        public string ApplicantsPreferredLanguage { get; set; }
        public int? ApplicantsInterpreterNeeded { get; set; }

        [Required]
        [StringLength(250)]
        public string ApplicantsPrimaryAddressLine1 { get; set; }

        [StringLength(250)]
        public string ApplicantsPrimaryAddressLine2 { get; set; }

        [Required]
        [StringLength(100)]
        public string ApplicantsPrimaryCity { get; set; }

        [Required]
        [StringLength(100)]
        public string ApplicantsPrimaryProvince { get; set; }

        [Required]
        [StringLength(100)]
        public string ApplicantsPrimaryCountry { get; set; }

        [Required]
        [StringLength(20)]
        public string ApplicantsPrimaryPostalCode { get; set; }
        public int? ApplicantsOkToSendMail { get; set; }
        public int? ApplicantsMethodOfContact1Type { get; set; }

        [StringLength(100)]
        public string ApplicantsMethodOfContact1Number { get; set; }

        [StringLength(100)]
        public string ApplicantsMethodOfContact1Ext { get; set; }
        public int? ApplicantsMethodOfContact1LeaveDetailedMessage { get; set; }
        public int? ApplicantsMethodOfContact2Type { get; set; }

        [StringLength(100)]
        public string ApplicantsMethodOfContact2Number { get; set; }
        public int? ApplicantsMethodOfContact2LeaveDetailedMessage { get; set; }
        public int? ApplicantsMethodOfContact3Type { get; set; }

        [StringLength(100)]
        public string ApplicantsMethodOfContact3Number { get; set; }
        public int? ApplicantsMethodOfContact3LeaveDetailedMessage { get; set; }
        public int? ApplicantsNotificationTo { get; set; }
        public int? ApplicantsDiscussVTFAppWithVSP { get; set; }

        public int? ApplicantsSignificantCourtUpdates { get; set; }
        public int? ApplicantsFinalCourtResults { get; set; }
        public int? ApplicantsUpdatesOnAllCriminalCourtAppearances { get; set; }
        public int? ApplicantsCriminalCourtOrdersIssued { get; set; }
        public int? ApplicantsBCCorrectionsInformation { get; set; }

        [StringLength(250)]
        public string ApplicantsNotificationAdditionalComments { get; set; }

        public string ApplicantsTravelExpenseRequest03 { get; set; }

        [StringLength(100)]
        public string ApplicantsTravelExpenseRequestTransportOther { get; set; }

        [StringLength(100)]
        public string ApplicantsTravelExpenseRequestOther { get; set; }
        public string ApplicantsPurposeOfTravel { get; set; }
        public DateTime? ApplicantsTravelPeriodFrom { get; set; }
        public DateTime? ApplicantsTravelPeriodTo { get; set; }

        [StringLength(250)]
        public string ApplicantsAdditionalTravelComments { get; set; }

        public int? ApplicantsInfoShareCSCPBC { get; set; }
        public int? ApplicantsInfoShareVSU { get; set; }
        public int? ApplicantsInfoShareVSW { get; set; }
        public int? ApplicantsDeclarationVerified { get; set; }

        [StringLength(150)]
        public string ApplicantsDeclarationFullName { get; set; }
        public DateTime? ApplicantsDeclarationDate { get; set; }
        public string ApplicantsSignature { get; set; }
    }
}
