import { iAddress } from "./address.interface";

export interface iNotificationApplication {
    CaseInformation: iCaseInformation;
    ApplicantInformation: iApplicantInformation;
    RecipientDetails: iRecipientDetails;
    AuthorizationInformation: iAuthorizationInformation;
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
}

export interface iApplicantInformation {
    applicantType: number;
    applicantTypeOther: string;
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
    name: string;
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
    extension: string;
    email: string;
    city: string;
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