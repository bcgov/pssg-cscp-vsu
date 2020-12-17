import { iAddress } from "./address.interface";
import { iOffence } from "./lookup-data.interface";

export interface iNotificationApplication {
    CaseInformation: iCaseInformation;
    ApplicantInformation: iApplicantInformation;
    RecipientDetails: iRecipientDetails;
    AuthorizationInformation: iAuthorizationInformation;
}

export interface iTravelFundApplication {
    OverviewInformation: iOverviewInformation;
    ApplicantInformation: iApplicantInformation;
    CaseInformation: iCaseInformation;
    TravelInformation: iTravelInformation;
    AuthorizationInformation: iAuthorizationInformation;
}

export interface iOverviewInformation {
    offencesComment: string;
    proceedingsImpactOutcome: number;
    proceedingsImpactOutcomeComment: string;
    travelMoreThan100KM: number;
    travelMoreThan100KMComment: string;
    notCoveredByOtherSources: number;
    notCoveredByOtherSourcesComment: string;
    additionalComments: string;
}

export interface iCaseInformation {
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    gender: number;
    genderOther: string;
    courtInfo: iCourtInfo[];
    accusedFirstName: string;
    accusedMiddleName: string;
    accusedLastName: string;
    accusedBirthDate: Date;
    accusedGender: number;
    additionalAccused: iAdditionalAccused[];
    offences?: iOffenceInformation[];
    crownCounsel?: iCrownCounsel[];
    victimServiceWorker?: iVictimServiceWorker[];
    victimInfoSameAsApplicant: boolean;
}

export interface iApplicantInformation {
    applicantType: number;
    applicantTypeOther: string;
    supportPersonRelationship: string;
    IFMRelationship: string;

    victimAlreadySubmitted: number;
    victimAlreadySubmittedComment: string;
    otherFamilyAlsoApplying: number;
    otherFamilyAlsoApplyingComment: string;

    applicantInfoSameAsVictim: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    gender: number;
    genderOther: string;
    preferredLanguage: string;
    interpreterNeeded: number;
    address: iAddress;
    mayWeSendCorrespondence: number;
    contactMethods: iContactMethod[];
    atLeastOneContactMethod: string;

    vswComment?: string
    coveredByVictimServiceProgram?: number;
    coveredByVictimServiceProgramComment?: string;
    victimServiceWorker?: iVictimServiceWorker[];
}

export interface iRecipientDetails {
    notificationRecipient: number;
    victimServiceWorker: iVictimServiceWorker[];
    designate: iDesignate[];
    courtUpdates: number;
    courtResults: number;
    courtAppearances: number;
    courtOrders: number;
    correctionsInformation: number;
    atLeastOneNotification: string;
    additionalComments: string;
}

export interface iTravelInformation {
    expenses: TravelExpenses;
    courtDates: Date[];
    purposeOfTravel: string;
    travelPeriodStart: Date;
    travelPeriodEnd: Date;
    additionalComments: string;
}

export interface TravelExpenses {
    applyForAccommodation: boolean;
    applyForTransportationBus: boolean;
    applyForTransportationFerry: boolean;
    applyForTransportationFlights: boolean;
    applyForTransportationMileage: boolean;
    applyForTransportationOther: boolean;
    applyForMeals: boolean;
    applyForOther: boolean;
    applyForTransportationOtherText: string;
    applyForOtherText: string;
}

export interface iAuthorizationInformation {
    registerForVictimNotification: number;
    permissionToShareContactInfo: number;
    permissionToContactMyVSW: number;
    declaration: number;
    fullName: string;
    date: Date;
    signature: string;
}

export interface iAdditionalAccused {
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: Date;
    gender: number;
}

export interface iCourtInfo {
    courtFileNumber: string;
    courtLocation: string;
}

export interface iContactMethod {
    type: number;
    val: string;
    label: string;
    leaveMessage: number;
}

export interface iVictimServiceWorker {
    firstName: string;
    lastName: string;
    organization: string;
    telephone: string;
    extension?: string;
    email: string;
    city?: string;
}

export interface iOffenceInformation {
    id: string;
    name: string;
    criminal_code: string;
    checked: boolean;
}

export interface iDesignate {
    firstName: string;
    middleName: string;
    lastName: string;
    relationship: string;
    addressSameAsApplicant: boolean;
    address: iAddress;
    mayWeSendCorrespondence: number;
    contactMethods: iContactMethod[];
    atLeastOneContactMethod: string;
}

export interface iCrownCounsel {
    firstName: string;
    lastName: string;
    telephone: string;
}