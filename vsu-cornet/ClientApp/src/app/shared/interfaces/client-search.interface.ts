export interface IClient {
    clientNumber: string;
    isCurrentName: string;
    locationTypeCode: ILocationType;
    personBirthDate: string;
    personGenderIdentityCodeType: string;
    personName: string;
}

export interface ILocationType {
    community: string;
    custody: string;
}