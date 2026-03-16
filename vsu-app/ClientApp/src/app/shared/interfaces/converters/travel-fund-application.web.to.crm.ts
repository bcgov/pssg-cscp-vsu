import {
  CourtInfoDto,
  OffenceDto,
  ParticipantDto,
  TravelInfoDto,
  VtfApplicationDataDto,
  VtfApplicationDto
} from 'src/model';
import { ApplicationType, EnumHelper, PARTICIPANT_TYPES } from '../../enums-list';
import { iTravelFundApplication } from '../application.interface';

export function convertTravelFundApplicationToCRM(application: iTravelFundApplication): VtfApplicationDataDto {
  return {
    application: getCRMApplication(application),
    courtInfoCollection: getCRMCourtInfoCollection(application),
    documentCollection: [],
    offenceCollection: getOffenceInfo(application),
    providerCollection: getCRMProviderCollection(application),
    travelInfoCollection: getCRMTravelInfoCollection(application)
  };
}

function getCRMApplication(application: iTravelFundApplication): VtfApplicationDto {
  let enums = new EnumHelper();

  let temp: any = null;

  let relationship_to_victim = '';
  if (application.ApplicantInformation.applicantType === enums.ApplicantType.Support_Person.val) {
    relationship_to_victim = application.ApplicantInformation.supportPersonRelationship;
  } else if (application.ApplicantInformation.applicantType === enums.ApplicantType.Immediate_Family_Member.val) {
    relationship_to_victim = application.ApplicantInformation.IFMRelationship;
  }

  let crm_application: VtfApplicationDto = {
    applicationType: ApplicationType.TRAVEL_FUNDS,

    offencesComments: application.OverviewInformation.offencesComment,
    decision1ImpactToOutcome: application.OverviewInformation.proceedingsImpactOutcome,
    decision1Comments: application.OverviewInformation.proceedingsImpactOutcomeComment,
    decision2TravelOver100KM: application.OverviewInformation.travelMoreThan100KM,
    decision2Comments: application.OverviewInformation.travelMoreThan100KMComment,
    decision3NoOtherFundingSource: application.OverviewInformation.notCoveredByOtherSources,
    decision3Comments: application.OverviewInformation.notCoveredByOtherSourcesComment,
    additionalComments: application.OverviewInformation.additionalComments,

    applicantType: application.ApplicantInformation.applicantType,
    relationshipToVictim: relationship_to_victim,

    victimTravelFundApplicationSubmitted: application.ApplicantInformation.victimAlreadySubmitted,
    victimTravelFundApplicationSubmittedUnknownComments: application.ApplicantInformation.victimAlreadySubmittedComment,

    otherFamilyMembersApplyingToVTF: application.ApplicantInformation.otherFamilyAlsoApplying,
    otherFamilyMembersVTFOtherComments: application.ApplicantInformation.otherFamilyAlsoApplyingComment,

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
      ? Number(application.ApplicantInformation.contactMethods[0].type)
      : null,
    applicantsMethodOfContact1Number: application.ApplicantInformation.contactMethods[0].val
      ? application.ApplicantInformation.contactMethods[0].val
      : null,
    applicantsMethodOfContact1LeaveDetailedMessage: application.ApplicantInformation.contactMethods[0].val
      ? application.ApplicantInformation.contactMethods[0].leaveMessage
      : null,
    applicantsMethodOfContact2Type: application.ApplicantInformation.contactMethods[1].val
      ? Number(application.ApplicantInformation.contactMethods[1].type)
      : null,
    applicantsMethodOfContact2Number: application.ApplicantInformation.contactMethods[1].val
      ? application.ApplicantInformation.contactMethods[1].val
      : null,
    applicantsMethodOfContact2LeaveDetailedMessage: application.ApplicantInformation.contactMethods[1].val
      ? application.ApplicantInformation.contactMethods[1].leaveMessage
      : null,
    applicantsMethodOfContact3Type: application.ApplicantInformation.contactMethods[2].val
      ? Number(application.ApplicantInformation.contactMethods[2].type)
      : null,
    applicantsMethodOfContact3Number: application.ApplicantInformation.contactMethods[2].val
      ? application.ApplicantInformation.contactMethods[2].val
      : null,
    applicantsMethodOfContact3LeaveDetailedMessage: application.ApplicantInformation.contactMethods[2].val
      ? application.ApplicantInformation.contactMethods[2].leaveMessage
      : null,

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

    applicantsTravelExpenseRequest03: '',
    applicantsTravelExpenseRequestTransportOther: '',
    applicantsTravelExpenseRequestOther: application.TravelInformation.expenses.applyForOtherText,
    applicantsAdditionalTravelComments: application.TravelInformation.additionalComments,

    applicantsDeclarationVerified: application.AuthorizationInformation.declaration
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    applicantsDeclarationFullName: application.AuthorizationInformation.fullName,
    applicantsDeclarationDate: application.AuthorizationInformation.date?.toISOString(),
    applicantsSignature: application.AuthorizationInformation.signature
  };

  if (
    application.ApplicantInformation.applicantType === enums.ApplicantType.Victim_Service_Worker.val &&
    application.ApplicantInformation.victimServiceWorker.length > 0
  ) {
    //TODO - need fields in dynamics to capture vsw info (labled as Manager name on the webform)
    crm_application.vswComments = application.ApplicantInformation.vswComment;
    crm_application.costsCoveredByVSP = application.ApplicantInformation.coveredByVictimServiceProgram;
    crm_application.vspComments = application.ApplicantInformation.coveredByVictimServiceProgramComment;

    crm_application.managerFirstName = application.ApplicantInformation.victimServiceWorker[0].firstName;
    crm_application.managerLastName = application.ApplicantInformation.victimServiceWorker[0].lastName;
    crm_application.organizationAgencyName = application.ApplicantInformation.victimServiceWorker[0].organization;
    crm_application.managerPhone = application.ApplicantInformation.victimServiceWorker[0].telephone;
    crm_application.managerEmail = application.ApplicantInformation.victimServiceWorker[0].email;
  }

  if (application.CaseInformation.victimServiceWorker.length > 0) {
    crm_application.applicantsDiscussVTFAppWithVSP =
      application.CaseInformation.victimServiceWorker[0].okToDiscussTravel || null;
  }

  let requested_expenses = [];

  if (application.TravelInformation.expenses.applyForAccommodation) {
    requested_expenses.push(enums.TravelExpenses.Accommodation.val);
  }

  if (application.TravelInformation.expenses.applyForTransportationBus) {
    requested_expenses.push(enums.TravelExpenses.TransportationBus.val);
  }

  if (application.TravelInformation.expenses.applyForTransportationFerry) {
    requested_expenses.push(enums.TravelExpenses.TransportationFerry.val);
  }

  if (application.TravelInformation.expenses.applyForTransportationFlights) {
    requested_expenses.push(enums.TravelExpenses.TransportationFlights.val);
  }

  if (application.TravelInformation.expenses.applyForTransportationMileage) {
    requested_expenses.push(enums.TravelExpenses.TransportationMileage.val);
  }

  if (application.TravelInformation.expenses.applyForTransportationOther) {
    requested_expenses.push(enums.TravelExpenses.TransportationOther.val);
    crm_application.applicantsTravelExpenseRequestTransportOther =
      application.TravelInformation.expenses.applyForTransportationOtherText;
  }

  if (application.TravelInformation.expenses.applyForMeals) {
    requested_expenses.push(enums.TravelExpenses.Meals.val);
  }

  if (application.TravelInformation.expenses.applyForOther) {
    requested_expenses.push(enums.TravelExpenses.Other.val);
  }

  crm_application.applicantsTravelExpenseRequest03 = requested_expenses.join(',');

  return crm_application;
}
function getCRMCourtInfoCollection(application: iTravelFundApplication) {
  let court_info_collection: CourtInfoDto[] = [];

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

function getOffenceInfo(application: iTravelFundApplication) {
  let offence_collection: OffenceDto[] = [];
  offence_collection = application.CaseInformation.offences
    .filter((o) => o.checked)
    .map((o) => {
      return { vsd_offenseid: o.id };
    });
  return offence_collection;
}

function getCRMTravelInfoCollection(application: iTravelFundApplication) {
  let travel_collection: TravelInfoDto[] = [];
  let courtFileNumber = '';
  if (application.CaseInformation.courtInfo.length > 0) {
    courtFileNumber = application.CaseInformation.courtInfo[0].courtFileNumber;
  }

  application.TravelInformation.courtDates.forEach((c) => {
    travel_collection.push({
      vsd_courtdate: c.courtDate?.toISOString() ?? null,
      vsd_courtfilenumber_text: courtFileNumber,
      vsd_purposeoftravel: c.purposeOfTravel,
      vsd_travelperiodfrom: c.travelPeriodStart?.toISOString() ?? null,
      vsd_travelperiodto: c.travelPeriodEnd?.toISOString() ?? null
    });
  });

  return travel_collection;
}

function getCRMProviderCollection(application: iTravelFundApplication) {
  let provider_collection: ParticipantDto[] = [];
  let enums = new EnumHelper();

  //CaseInformation Accused / Offender
  provider_collection.push({
    vsd_firstname: application.CaseInformation.accusedFirstName,
    vsd_middlename: application.CaseInformation.accusedMiddleName,
    vsd_lastname: application.CaseInformation.accusedLastName,
    vsd_birthdate: application.CaseInformation.accusedBirthDate
      ? new Date(application.CaseInformation.accusedBirthDate).toISOString()
      : null,
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
      vsd_birthdate: accused.birthDate ? new Date(accused.birthDate).toISOString() : null,
      vsd_gender: accused.gender,
      vsd_relationship1: PARTICIPANT_TYPES.ACCUSED,
      vsd_relationship2: accused.relationship
    });
  });

  //Crown Counsel
  if (application.CaseInformation.crownCounsel) {
    application.CaseInformation.crownCounsel.forEach((cc) => {
      if (checkObjectHasValue(cc)) {
        provider_collection.push({
          vsd_firstname: cc.firstName,
          vsd_lastname: cc.lastName,
          vsd_vsu_methodofcontact1type: cc.telephone ? enums.ContactType.Telephone.val : null,
          vsd_vsu_methodofcontact1number: cc.telephone,
          vsd_relationship1: PARTICIPANT_TYPES.CROWN_COUNSEL,
          vsd_relationship1other: ''
        });
      }
    });
  }

  //Victim Service Worker
  if (application.CaseInformation.victimServiceWorker) {
    application.CaseInformation.victimServiceWorker.forEach((vsw) => {
      //if any field besides okToDiscussTravel has data - we need to add this provider
      //otherwise we don't add a vsw provider
      let testVSW = structuredClone(vsw);
      delete testVSW['okToDiscussTravel'];
      if (checkObjectHasValue(testVSW)) {
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
      }
    });
  }

  return provider_collection;
}

function checkObjectHasValue(obj: any) {
  return Object.values(obj).some((value) => !!value);
}
