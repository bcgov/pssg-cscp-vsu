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

export interface IClientParameters {
    search_type?: string;
    surname?: string;
    given1?: string;
    given2?: string;
    birth_year?: string;
    birth_year_range?: string;
    gender?: string;
    identifier_type?: string;
    identifier_text?: string;
}