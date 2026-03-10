import { ApplicationDto } from 'src/model';

export interface iApplicationFormCRM {
  Application: ApplicationDto;
  CourtInfoCollection: iCRMCourtInfo[];
  DocumentCollection: iCRMDocument[];
  OffenceCollection?: iCRMOffence[];
  PoliceFileNumberCollection: iCRMPoliceFileNumber[];
  ProviderCollection: iCRMParticipant[];
  TravelInfoCollection?: iCRMTravelInfo[];
}

export interface iCRMCourtInfo {
  vsd_courtfilenumber: string;
  vsd_courtlocation: string;
}
export interface iCRMPoliceFileNumber {
  vsd_policefilenumber: string;
  vsd_investigatingpoliceofficername: string;
  vsd_policeforce: string;
  vsd_reportdate: Date;
}
export interface iCRMParticipant {
  vsd_firstname?: string;
  vsd_middlename?: string;
  vsd_lastname?: string;
  vsd_companyname?: string;
  vsd_name?: string;
  vsd_birthdate?: Date;
  vsd_gender?: number;
  vsd_genderidentitytext?: string;
  vsd_pronouns?: number;
  vsd_pronountext?: string;
  vsd_primaryraceethnicity?: number;
  vsd_primaryraceethnicitytext?: string;
  vsd_phonenumber?: string;
  vsd_mainphoneextension?: string;
  vsd_addressline1?: string;
  vsd_addressline2?: string;
  vsd_city?: string;
  vsd_province?: string;
  vsd_postalcode?: string;

  vsd_vsu_oktosendmail?: number;

  vsd_email?: string;
  vsd_relationship1: string;
  vsd_relationship1other?: string;
  vsd_relationship2?: string;
  vsd_relationship2other?: string;

  vsd_vsu_methodofcontact1type?: number;
  vsd_vsu_methodofcontact1number?: string;
  vsd_vsu_methodofcontact1ext?: string;
  vsd_vsu_methodofcontact1leavedetailedmessage?: number;
  vsd_vsu_methodofcontact2type?: number;
  vsd_vsu_methodofcontact2number?: string;
  vsd_vsu_methodofcontact2leavedetailedmessage?: number;
  vsd_vsu_methodofcontact3type?: number;
  vsd_vsu_methodofcontact3number?: string;
  vsd_vsu_methodofcontact3leavedetailedmessage?: number;
}

export interface iCRMTravelInfo {
  vsd_courtdate?: Date;
  vsd_courtfilenumber_text?: string;
  vsd_purposeoftravel: string;
  vsd_travelperiodfrom: Date;
  vsd_travelperiodto: Date;
}

export interface iCRMDocument {
  filename: string;
  body: string;
  subject: string;
}

export interface iCRMOffence {
  vsd_offenseid: string;
}
