// Test data builders for the VSU application submission journey.
//
// Every record created by these tests MUST be trivially identifiable as
// load-test data so it can be found and purged from Dataverse afterwards.
// We do this by prefixing names/free-text fields with LOAD_TEST_TAG and a
// per-run marker (K6 run id + timestamp), and by never reusing a real
// person's information.
//
// Field notes: several ApplicationDto fields are Dataverse option-set
// integers, not booleans - e.g. VSd_YesNo.No=100000000/Yes=100000001,
// VSd_VSu_ApplicantType.Victim=100000000, VSd_VSu_ApplicationType.
// Notification=100000000/VictimTravelFund=100000001. Passing raw 0/1 here
// is invalid and will be rejected - see restitution's MANUAL.md "When the
// API changes" for the story on how that bug was found there.
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const LOAD_TEST_TAG = 'K6-LOADTEST';

// Unique per test-run marker so a single execution's records can be found
// and deleted together (e.g. search Dataverse for this value).
export const RUN_MARKER = __ENV.RUN_MARKER || `${Date.now()}`;

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley'];
const LAST_NAMES = ['Sample', 'Synthetic', 'Placeholder', 'Fixture'];
const CITIES = ['Victoria', 'Vancouver', 'Kelowna', 'Prince George'];

// Dataverse option-set values used below (see Database/OptionSets/*.cs):
const VSd_YesNo_No = 100000000;
const VSd_VSu_ApplicantType_Victim = 100000000;
const VSd_VSu_ApplicationType_Notification = 100000000;
const VSd_VSu_ApplicationType_VictimTravelFund = 100000001;

function taggedName(prefix) {
  return `${LOAD_TEST_TAG}-${prefix}-${RUN_MARKER}-${randomIntBetween(1000, 9999)}`;
}

function person() {
  return {
    firstName: taggedName(randomItem(FIRST_NAMES)),
    lastName: taggedName(randomItem(LAST_NAMES)),
  };
}

// Shared fields across notification / VTF / VTF-reimbursement applications.
// `applicationType` and the Decision1-3 fields differ per case type - see
// the exported builders below.
function baseApplication(applicationType, decisionFields) {
  const victim = person();
  const applicant = person();
  return {
    ApplicationType: applicationType,
    VictimFirstName: victim.firstName,
    VictimMiddleName: '',
    VictimLastName: victim.lastName,
    VictimBirthDate: '1990-01-01T00:00:00Z',
    OtherFirstname: '',
    OtherLastname: '',
    DateOfNameChange: null,
    VictimGenderCode: null,
    VictimGenderText: '',
    VictimPronouns: null,
    VictimPronounText: '',
    VictimPrimaryRaceEthnicity: null,
    VictimPrimaryRaceEthnicityText: '',
    VictimIndigenous: null,
    ApplicantType: VSd_VSu_ApplicantType_Victim,
    ApplicantTypeOther: '',
    OffencesComments: '',
    ...decisionFields,
    AdditionalComments: '',
    RelationshipToVictim: '',
    VictimTravelFundApplicationSubmitted: null,
    VictimTravelFundApplicationSubmittedUnknownComments: '',
    OtherFamilyMembersApplyingToVTF: null,
    OtherFamilyMembersVTFOtherComments: '',
    VSWComments: '',
    CostsCoveredByVSP: null,
    VSPComments: '',
    ManagerFirstName: '',
    ManagerLastName: '',
    OrganizationAgencyName: '',
    ManagerPhone: '',
    ManagerEmail: '',
    ApplicantsFirstName: applicant.firstName,
    ApplicantsMiddleName: '',
    ApplicantsLastName: applicant.lastName,
    ApplicantsMaritalStatus: null,
    ApplicantsGenderCode: null,
    ApplicantsGenderIdentityText: '',
    ApplicantsPronouns: null,
    ApplicantsPronounText: '',
    ApplicantsBirthDate: '1990-01-01T00:00:00Z',
    ApplicantsPrimaryRaceEthnicity: null,
    ApplicantsPrimaryRaceEthnicityText: '',
    ApplicantsIndigenous: null,
    ApplicantsPreferredLanguage: '',
    ApplicantsInterpreterNeeded: null,
    ApplicantsPrimaryAddressLine1: `${randomIntBetween(100, 999)} ${LOAD_TEST_TAG} St`,
    ApplicantsPrimaryAddressLine2: '',
    ApplicantsPrimaryCity: randomItem(CITIES),
    ApplicantsPrimaryProvince: 'BC',
    ApplicantsPrimaryCountry: 'Canada',
    ApplicantsPrimaryPostalCode: 'V8V8V8',
    ApplicantsOkToSendMail: null,
    ApplicantsMethodOfContact1Type: null,
    ApplicantsMethodOfContact1Number: '2505550100',
    ApplicantsMethodOfContact1Ext: '',
    ApplicantsMethodOfContact1LeaveDetailedMessage: null,
    ApplicantsMethodOfContact2Type: null,
    ApplicantsMethodOfContact2Number: '',
    ApplicantsMethodOfContact2LeaveDetailedMessage: null,
    ApplicantsMethodOfContact3Type: null,
    ApplicantsMethodOfContact3Number: '',
    ApplicantsMethodOfContact3LeaveDetailedMessage: null,
    ApplicantsNotificationTo: null,
    ApplicantsDiscussVTFAppWithVSP: null,
    ApplicantsSignificantCourtUpdates: null,
    ApplicantsFinalCourtResults: null,
    ApplicantsUpdatesOnAllCriminalCourtAppearances: null,
    ApplicantsCriminalCourtOrdersIssued: null,
    ApplicantsBCCorrectionsInformation: null,
    ApplicantsNotificationAdditionalComments: '',
    ApplicantsTravelExpenseRequest03: '',
    ApplicantsTravelExpenseRequestTransportOther: '',
    ApplicantsTravelExpenseRequestOther: '',
    ApplicantsPurposeOfTravel: '',
    ApplicantsTravelPeriodFrom: null,
    ApplicantsTravelPeriodTo: null,
    ApplicantsAdditionalTravelComments: '',
    ApplicantsInfoShareCSCPBC: null,
    ApplicantsInfoShareVSU: null,
    ApplicantsInfoShareVSW: null,
    ApplicantsDeclarationVerified: null,
    ApplicantsDeclarationFullName: `${applicant.firstName} ${applicant.lastName}`,
    ApplicantsDeclarationDate: new Date().toISOString(),
    ApplicantsSignature: `${LOAD_TEST_TAG}-signature-${RUN_MARKER}`,
  };
}

function courtInfoCollection() {
  return [
    {
      vsd_courtfilenumber: `${LOAD_TEST_TAG}-${RUN_MARKER}`,
      vsd_courtlocation: 'Victoria',
    },
  ];
}

function emptyCollection() {
  return [];
}

// POST /api/application/notification
export function buildNotificationApplicationPayload() {
  return {
    Application: baseApplication(VSd_VSu_ApplicationType_Notification, {
      // Decision1-3 fields are not required for Notification applications.
      Decision1ImpactToOutcome: null,
      Decision1Comments: '',
      Decision2TravelOver100KM: null,
      Decision2Comments: '',
      Decision3NoOtherFundingSource: null,
      Decision3Comments: '',
    }),
    CourtInfoCollection: courtInfoCollection(),
    ProviderCollection: emptyCollection(),
    OffenceCollection: emptyCollection(),
    TravelInfoCollection: emptyCollection(),
    DocumentCollection: emptyCollection(),
  };
}

// POST /api/application/vtf
export function buildVtfApplicationPayload() {
  return {
    Application: baseApplication(VSd_VSu_ApplicationType_VictimTravelFund, {
      // Decision1-3 are required for VTF applications - VSd_YesNo.No is a
      // safe synthetic default.
      Decision1ImpactToOutcome: VSd_YesNo_No,
      Decision1Comments: '',
      Decision2TravelOver100KM: VSd_YesNo_No,
      Decision2Comments: '',
      Decision3NoOtherFundingSource: VSd_YesNo_No,
      Decision3Comments: '',
    }),
    CourtInfoCollection: courtInfoCollection(),
    ProviderCollection: emptyCollection(),
    OffenceCollection: emptyCollection(),
    TravelInfoCollection: emptyCollection(),
    DocumentCollection: emptyCollection(),
  };
}

// POST /api/application/vtf-reimbursement
export function buildVtfReimbursementApplicationPayload() {
  return {
    Application: baseApplication(VSd_VSu_ApplicationType_VictimTravelFund, {
      // Decision1-3 fields are not required for VTF Reimbursement applications.
      Decision1ImpactToOutcome: null,
      Decision1Comments: '',
      Decision2TravelOver100KM: null,
      Decision2Comments: '',
      Decision3NoOtherFundingSource: null,
      Decision3Comments: '',
    }),
    CourtInfoCollection: courtInfoCollection(),
    ProviderCollection: emptyCollection(),
    OffenceCollection: emptyCollection(),
    TravelInfoCollection: emptyCollection(),
    DocumentCollection: emptyCollection(),
  };
}
