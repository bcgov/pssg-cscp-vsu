import { ILocationType } from "./client-search.interface";

export interface IClientDetails {
    clientNumber?: string;
    isCurrentName?: string;
    locationTypeCode?: ILocationType;
    personBirthDate?: string;
    personGenderIdentityCodeType?: string;
    personName?: string;
    lastName?: string;
    givenNames?: string;
    notifications?: INotification[];

    coastInfo?: ICoastOffender;

    authorityDocuments?: IAuthorityDocument[];
    hearings?: IHearing[];
    keyDates?: IKeyDate[];
    movements?: IMovement[];
    stateTransitions?: IStateTransition[];
    victimContacts?: IVictimContact[];
}

export interface ICoastOffender {
    _vsd_contactid_value: string;
    vsd_aliasnames: string;
    vsd_awol: number;
    vsd_birthdate: string;
    vsd_communitystatus: number;
    vsd_csnumber: string;
    vsd_firstname: string;
    vsd_gender: number;
    vsd_incustody: number;
    vsd_inout: number;
    vsd_intermittentsentence: number;
    vsd_lastname: string;
    vsd_offenderid: string;
    vsd_policefilenumber: string;
    vsd_probationofficerbailsupervisor: string;
    vsd_reportingorder: number;
}

export interface INotification {
    notificationId: string;
    eventId: string;
    eventDate: Date;
    eventReferenceId: string;
    eventType: number;
    id: string;
}

export interface IAuthorityDocument {
    activeYn: string;
    authorityDocumentId: string;
    authorityDocumentNumbers: string[];
    chargeCounts: IChargeCount[];
    clientNumber: string;
    closeReasonCode: string;
    closeReasonDescription: string;
    courtLocationCode: string;
    courtLocationDescription: string;
    documentTypeCode: string;
    documentTypeDescription: string;
    effectiveDate: Date;
    expiryDate: Date;
    issueDate: Date;
}

export interface IChargeCount {
    countSeqNo: string;
    fileNumber: string;
    statuteAct: string;
    statuteDescription: string;
    statuteSectionNo: string;
    statuteSubsectionParagraph: string;
}

export interface IHearing {
    activityDate: IActivityDate;
    activityId: string;
    activityType: IActivityInfo;
    clientNumber: string;
    hearingCategory: IActivityInfo;
    hearingComment: string;
    hearingDecision: IActivityInfo;
    hearingRequestType: IActivityInfo;
}

export interface IKeyDate {
    activityCategory: IActivityInfo;
    activityDate: string;
    activityDescription: string;
    activityId: string;
    clientNumber: string;
}

export interface IActivityInfo {
    code: string;
    description: string;
}
export interface IActivityDate {
    actual: string;
    scheduled: string;
    val?: string;
}
export interface IDateRange {
    from: string;
    to: string;
}
export interface IMovement {
    activityCategory: IActivityInfo;
    activityDate: IActivityDate;
    activityDescription: string;
    activityId: string;
    activityReason: IActivityInfo;
    activitySubCategory: IActivityInfo;
    clientNumber: string;
    facilityType: string;
    supervisionFacility: IDateRange;
}

export interface IStateTransition {
    activityId: string;
    activityReason: IActivityInfo;
    activitySubType: IActivityInfo;
    activityType: IActivityInfo;
    clientNumber: string;
    identificationId: string;
}

export interface IVictimContact {
    businessAddressEffectiveDate: string;
    businessAddressFull: string;
    cellNumberType: ITelephoneInfo;
    clientNumber: string;
    emailType: IEmailType;
    mailingAddressEffectiveDate: string;
    mailingAddressFull: string;
    personFullName: string;
    personId: string;
    primaryAddressEffectiveDate: string;
    primaryAddressFull: string;
    secondaryAddressEffectiveDate: string;
    secondaryAddressFull: string;
    telephoneNumberType: ITelephoneInfo;
    victimContactComment: string;
    victimContactDate: IContactDate;
    victimToPersonRelationship: string;
}

export interface IContactDate {
    effective: string;
    expiry: string;
}

export interface ITelephoneInfo {
    effectiveDate: string;
    isPrimary: string;
    number: string;
}

export interface IEmailType {
    effectiveDate: string;
    emailAddress: string;
    isPrimary: string;
}