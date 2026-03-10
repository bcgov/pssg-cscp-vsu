import { ApplicationDto } from 'src/model';
import { ApplicationType, EnumHelper, PARTICIPANT_TYPES } from '../../enums-list';
import { iNotificationApplication } from '../application.interface';
import { iApplicationFormCRM, iCRMCourtInfo, iCRMParticipant } from '../dynamics/crm-application';

export function convertNotificationApplicationToCRM(application: iNotificationApplication) {
  let crm_application: iApplicationFormCRM = {
    Application: getCRMApplication(application),
    CourtInfoCollection: getCRMCourtInfoCollection(application),
    PoliceFileNumberCollection: [],
    ProviderCollection: getCRMProviderCollection(application),
    DocumentCollection: []
  };

  return crm_application;
}

function getCRMApplication(application: iNotificationApplication) {
  let enums = new EnumHelper();
  let crm_application: ApplicationDto = {
    applicationType: ApplicationType.NOTIFICATION,
    victimFirstName: application.CaseInformation.firstName,
    victimMiddleName: application.CaseInformation.middleName,
    victimLastName: application.CaseInformation.lastName,
    victimBirthDate: application.CaseInformation.birthDate?.toISOString(),
    victimGenderCode: application.CaseInformation.gender,
    victimGenderText: application.CaseInformation.otherGender,
    victimPronouns: application.CaseInformation.pronouns,
    victimPronounText: application.CaseInformation.otherPronouns,
    victimPrimaryRaceEthnicity: application.CaseInformation.raceEthnicity,
    victimPrimaryRaceEthnicityText: application.CaseInformation.otherRaceEthnicity,
    victimIndigenous: application.CaseInformation.indigenousStatus,

    decision1ImpactToOutcome: null,
    decision2TravelOver100KM: null,
    decision3NoOtherFundingSource: null,

    applicantType: application.ApplicantInformation.applicantType,
    applicantTypeOther: application.ApplicantInformation.applicantTypeOther,
    applicantsFirstName: application.ApplicantInformation.firstName,
    applicantsMiddleName: application.ApplicantInformation.middleName,
    applicantsLastName: application.ApplicantInformation.lastName,
    otherFirstname: '',
    otherLastname: '',
    dateOfNameChange: null,
    applicantsBirthDate: application.ApplicantInformation.birthDate?.toISOString(),
    applicantsGenderCode: application.ApplicantInformation.gender,
    applicantsGenderIdentityText: application.ApplicantInformation.otherGender,
    applicantsPronouns: application.ApplicantInformation.pronouns,
    applicantsPronounText: application.ApplicantInformation.otherPronouns,
    applicantsPrimaryRaceEthnicity: application.ApplicantInformation.raceEthnicity,
    applicantsPrimaryRaceEthnicityText: application.ApplicantInformation.otherRaceEthnicity,
    applicantsIndigenous: application.ApplicantInformation.indigenousStatus,
    applicantsMaritalStatus: null,

    applicantsPreferredLanguage: application.ApplicantInformation.preferredLanguage,
    applicantsInterpreterNeeded: application.ApplicantInformation.interpreterNeeded,
    applicantsPrimaryAddressLine1: application.ApplicantInformation.address.line1,
    applicantsPrimaryAddressLine2: application.ApplicantInformation.address.line2,
    applicantsPrimaryCity: application.ApplicantInformation.address.city,
    applicantsPrimaryProvince: application.ApplicantInformation.address.province,
    applicantsPrimaryCountry: application.ApplicantInformation.address.country,
    applicantsPrimaryPostalCode: application.ApplicantInformation.address.postalCode,
    applicantsOkToSendMail: application.ApplicantInformation.mayWeSendCorrespondence,

    //check if we set these - don't send any info if val is blank
    applicantsMethodOfContact1Type: application.ApplicantInformation.contactMethods[0].val
      ? application.ApplicantInformation.contactMethods[0].type
      : null,
    applicantsMethodOfContact1Number: application.ApplicantInformation.contactMethods[0].val
      ? application.ApplicantInformation.contactMethods[0].val
      : null,
    applicantsMethodOfContact1LeaveDetailedMessage: application.ApplicantInformation.contactMethods[0].val
      ? application.ApplicantInformation.contactMethods[0].leaveMessage
      : null,
    applicantsMethodOfContact2Type: application.ApplicantInformation.contactMethods[1].val
      ? application.ApplicantInformation.contactMethods[1].type
      : null,
    applicantsMethodOfContact2Number: application.ApplicantInformation.contactMethods[1].val
      ? application.ApplicantInformation.contactMethods[1].val
      : null,
    applicantsMethodOfContact2LeaveDetailedMessage: application.ApplicantInformation.contactMethods[1].val
      ? application.ApplicantInformation.contactMethods[1].leaveMessage
      : null,
    applicantsMethodOfContact3Type: application.ApplicantInformation.contactMethods[2].val
      ? application.ApplicantInformation.contactMethods[2].type
      : null,
    applicantsMethodOfContact3Number: application.ApplicantInformation.contactMethods[2].val
      ? application.ApplicantInformation.contactMethods[2].val
      : null,
    applicantsMethodOfContact3LeaveDetailedMessage: application.ApplicantInformation.contactMethods[2].val
      ? application.ApplicantInformation.contactMethods[2].leaveMessage
      : null,

    applicantsNotificationTo: application.RecipientDetails.notificationRecipient,
    applicantsSignificantCourtUpdates: application.RecipientDetails.courtUpdates
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsFinalCourtResults: application.RecipientDetails.courtResults
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsUpdatesOnAllCriminalCourtAppearances: application.RecipientDetails.courtAppearances
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsCriminalCourtOrdersIssued: application.RecipientDetails.courtOrders
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsBCCorrectionsInformation: application.RecipientDetails.correctionsInformation
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsNotificationAdditionalComments: application.RecipientDetails.additionalComments,

    applicantsInfoShareCSCPBC: application.AuthorizationInformation.registerForVictimNotification
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsInfoShareVSU: application.AuthorizationInformation.permissionToShareContactInfo
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsInfoShareVSW: application.AuthorizationInformation.permissionToContactMyVSW
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsDeclarationVerified: application.AuthorizationInformation.declaration
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,

    applicantsDeclarationFullName: application.AuthorizationInformation.fullName,
    applicantsDeclarationDate: application.AuthorizationInformation.date?.toISOString(),
    applicantsSignature: application.AuthorizationInformation.signature
  };
  return crm_application;
}
function getCRMCourtInfoCollection(application: iNotificationApplication) {
  let court_info_collection: iCRMCourtInfo[] = [];

  if (application.CaseInformation.courtInfo) {
    application.CaseInformation.courtInfo.forEach((court_info) => {
      court_info_collection.push({
        vsd_courtfilenumber: court_info.courtFileNumber,
        vsd_courtlocation: court_info.courtLocation
      });
    });
  }

  return court_info_collection;
}

function getCRMProviderCollection(application: iNotificationApplication) {
  let provider_collection: iCRMParticipant[] = [];
  let enums = new EnumHelper();

  //CaseInformation Accused / Offender
  provider_collection.push({
    vsd_firstname: application.CaseInformation.accusedFirstName,
    vsd_middlename: application.CaseInformation.accusedMiddleName,
    vsd_lastname: application.CaseInformation.accusedLastName,
    vsd_birthdate: application.CaseInformation.accusedBirthDate,
    vsd_gender: application.CaseInformation.accusedGender,
    vsd_genderidentitytext: application.CaseInformation.accusedOtherGender,
    vsd_pronouns: application.CaseInformation.accusedPronouns,
    vsd_pronountext: application.CaseInformation.accusedOtherPronouns,
    vsd_primaryraceethnicity: application.CaseInformation.accusedRaceEthnicity,
    vsd_primaryraceethnicitytext: application.CaseInformation.accusedOtherRaceEthnicity,
    vsd_relationship1: PARTICIPANT_TYPES.ACCUSED,
    vsd_relationship2: application.CaseInformation.accusedRelationship
  });

  //CaseInformation Additional Accused
  application.CaseInformation.additionalAccused.forEach((accused) => {
    provider_collection.push({
      vsd_firstname: accused.firstName,
      vsd_middlename: accused.middleName,
      vsd_lastname: accused.lastName,
      vsd_birthdate: accused.birthDate,
      vsd_gender: accused.gender,
      vsd_genderidentitytext: accused.otherGender,
      vsd_pronouns: accused.pronouns,
      vsd_pronountext: accused.otherPronouns,
      vsd_primaryraceethnicity: accused.raceEthnicity,
      vsd_primaryraceethnicitytext: accused.otherRaceEthnicity,
      vsd_relationship1: PARTICIPANT_TYPES.ACCUSED,
      vsd_relationship2: accused.relationship
    });
  });

  //Designate
  if (application.RecipientDetails.designate) {
    application.RecipientDetails.designate.forEach((designate) => {
      provider_collection.push({
        vsd_firstname: designate.firstName,
        vsd_middlename: designate.middleName,
        vsd_lastname: designate.lastName,
        vsd_addressline1: designate.address.line1,
        vsd_addressline2: designate.address.line2,
        vsd_city: designate.address.city,
        vsd_province: designate.address.province,
        vsd_postalcode: designate.address.postalCode,
        vsd_relationship1: PARTICIPANT_TYPES.DESIGNATE,
        vsd_relationship1other: '',
        vsd_relationship2: designate.relationship,
        vsd_relationship2other: '',

        vsd_vsu_oktosendmail: designate.mayWeSendCorrespondence,

        vsd_vsu_methodofcontact1type: designate.contactMethods[0].val ? designate.contactMethods[0].type : null,
        vsd_vsu_methodofcontact1number: designate.contactMethods[0].val ? designate.contactMethods[0].val : null,
        vsd_vsu_methodofcontact1leavedetailedmessage: designate.contactMethods[0].val
          ? designate.contactMethods[0].leaveMessage
          : null,
        vsd_vsu_methodofcontact2type: designate.contactMethods[1].val ? designate.contactMethods[1].type : null,
        vsd_vsu_methodofcontact2number: designate.contactMethods[1].val ? designate.contactMethods[1].val : null,
        vsd_vsu_methodofcontact2leavedetailedmessage: designate.contactMethods[1].val
          ? designate.contactMethods[1].leaveMessage
          : null,
        vsd_vsu_methodofcontact3type: designate.contactMethods[2].val ? designate.contactMethods[2].type : null,
        vsd_vsu_methodofcontact3number: designate.contactMethods[2].val ? designate.contactMethods[2].val : null,
        vsd_vsu_methodofcontact3leavedetailedmessage: designate.contactMethods[2].val
          ? designate.contactMethods[2].leaveMessage
          : null
      });
    });
  }

  //Victim Service Worker
  if (application.RecipientDetails.victimServiceWorker) {
    application.RecipientDetails.victimServiceWorker.forEach((vsw) => {
      provider_collection.push({
        vsd_firstname: vsw.firstName,
        vsd_lastname: vsw.lastName,
        vsd_companyname: vsw.organization,
        vsd_vsu_methodofcontact1type: vsw.telephone ? enums.ContactType.Telephone.val : null,
        vsd_vsu_methodofcontact1number: vsw.telephone,
        vsd_vsu_methodofcontact1ext: vsw.extension,
        vsd_city: vsw.city,
        vsd_vsu_methodofcontact2type: vsw.email ? enums.ContactType.Email.val : null,
        vsd_vsu_methodofcontact2number: vsw.email,
        vsd_relationship1: PARTICIPANT_TYPES.VICTIM_SERVICE_WORKER,
        vsd_relationship1other: ''
      });
    });
  }

  return provider_collection;
}
