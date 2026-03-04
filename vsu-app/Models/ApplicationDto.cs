using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class ApplicationDto
    {
        public int VsuApplicationType { get; set; }

        [StringLength(100)]
        public string VictimFirstName { get; set; }

        [StringLength(100)]
        public string VictimMiddleName { get; set; }

        [StringLength(100)]
        public string VictimLastName { get; set; }
        public DateTime? VictimBirthDate { get; set; }
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

        public int VsuApplicantType { get; set; }

        [StringLength(100)]
        public string VsuApplicantTypeOther { get; set; }

        [StringLength(500)]
        public string VsuOffencesComments { get; set; }
        public int? VsuDecision1ImpactToOutcome { get; set; }

        [StringLength(500)]
        public string VsuDecision1Comments { get; set; }
        public int? VsuDecision2TravelOver100Km { get; set; }

        [StringLength(500)]
        public string VsuDecision2Comments { get; set; }
        public int? VsuDecision3NoOtherFundingSource { get; set; }

        [StringLength(500)]
        public string VsuDecision3Comments { get; set; }

        [StringLength(500)]
        public string VsuAdditionalComments { get; set; }

        [StringLength(100)]
        public string RelationshipToVictim { get; set; }
        public int? VsuVictimTravelFundApplicationSubmitted { get; set; }

        [StringLength(100)]
        public string VsuVtfAppSubmittedUnknownComments { get; set; }
        public int? VsuOtherFamilyMembersApplyingToVtf { get; set; }

        [StringLength(100)]
        public string VsuOtherFamilyMembersVtfOtherComments { get; set; }

        public string VsuVswComments { get; set; }

        public int? VsuCostsCoveredByVsp { get; set; }

        [StringLength(500)]
        public string VsuVspComments { get; set; }

        [StringLength(250)]
        public string VsuManagerFirstName { get; set; }

        [StringLength(250)]
        public string VsuManagerLastName { get; set; }

        [StringLength(250)]
        public string VsuOrganizationAgencyName { get; set; }

        [StringLength(100)]
        public string VsuManagerPhone { get; set; }

        [StringLength(100)]
        public string VsuManagerEmail { get; set; }

        [StringLength(100)]
        public string ApplicantsFirstName { get; set; }

        [StringLength(100)]
        public string ApplicantsMiddleName { get; set; }

        [StringLength(100)]
        public string ApplicantsLastName { get; set; }
        public int? ApplicantsGenderCode { get; set; }

        [StringLength(100)]
        public string GenderIdentityText { get; set; }
        public int? Pronouns { get; set; }

        [StringLength(100)]
        public string PronounText { get; set; }

        public DateTime? ApplicantsBirthDate { get; set; }
        public int? PrimaryRaceEthnicity { get; set; }

        [StringLength(500)]
        public string PrimaryRaceEthnicityText { get; set; }
        public int? Indigenous { get; set; }

        [StringLength(100)]
        public string ApplicantsPreferredLanguage { get; set; }
        public int? ApplicantsInterpreterNeeded { get; set; }

        [StringLength(250)]
        public string ApplicantsPrimaryAddressLine1 { get; set; }

        [StringLength(250)]
        public string ApplicantsPrimaryAddressLine2 { get; set; }

        [StringLength(100)]
        public string ApplicantsPrimaryCity { get; set; }

        [StringLength(100)]
        public string ApplicantsPrimaryProvince { get; set; }

        [StringLength(100)]
        public string ApplicantsPrimaryCountry { get; set; }

        [StringLength(20)]
        public string ApplicantsPrimaryPostalCode { get; set; }
        public int? VsuOkToSendMail { get; set; }
        public int? VsuMethodOfContact1Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact1Number { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact1Ext { get; set; }
        public int? VsuMethodOfContact1LeaveDetailedMessage { get; set; }
        public int? VsuMethodOfContact2Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact2Number { get; set; }
        public int? VsuMethodOfContact2LeaveDetailedMessage { get; set; }
        public int? VsuMethodOfContact3Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact3Number { get; set; }
        public int? VsuMethodOfContact3LeaveDetailedMessage { get; set; }
        public int? VsuNotificationTo { get; set; }
        public int? VsuDiscussVtfAppWithVsp { get; set; }

        public int? VsuSignificantCourtUpdates { get; set; }
        public int? VsuFinalCourtResults { get; set; }
        public int? VsuUpdatesOnAllCriminalCourtAppearances { get; set; }
        public int? VsuCriminalCourtOrdersIssued { get; set; }
        public int? VsuBcCorrectionsInformation { get; set; }

        [StringLength(250)]
        public string VsuNotificationAdditionalComments { get; set; }

        public string VsuTravelExpenseRequest { get; set; }

        [StringLength(100)]
        public string VsuTravelExpenseRequestTransportOther { get; set; }

        [StringLength(100)]
        public string VsuTravelExpenseRequestOther { get; set; }
        public string VsuPurposeOfTravel { get; set; }
        public DateTime? VsuTravelPeriodFrom { get; set; }
        public DateTime? VsuTravelPeriodTo { get; set; }

        [StringLength(250)]
        public string VsuAdditionalTravelComments { get; set; }

        public int? VsuInfoShareCscpBc { get; set; }
        public int? VsuInfoShareVsu { get; set; }
        public int? VsuInfoShareVsw { get; set; }
        public int? DeclarationVerified { get; set; }

        [StringLength(150)]
        public string DeclarationFullName { get; set; }
        public DateTime? DeclarationDate { get; set; }
        public string ApplicantsSignature { get; set; }
    }
}
