import { CaseDto, DocumentDto, TravelInfoDto } from 'src/model';

export interface iReimbursementFormCRM {
  CaseId: CaseDto;
  ContactInfoComments: string;
  Invoice: iInvoice;
  TravelInfoCollection?: TravelInfoDto[];
  TransportationExpenseCollection?: iCRMInvoiceLineDetail[];
  AccommodationExpenseCollection?: iCRMInvoiceLineDetail[];
  MealExpenseCollection?: iCRMInvoiceLineDetail[];
  ChildcareExpenseCollection?: iCRMInvoiceLineDetail[];
  OtherExpenseCollection?: iCRMInvoiceLineDetail[];
  DocumentCollection?: DocumentDto[];
}

export interface iInvoice {
  vsd_vsu_claimantcontactinfochanged?: number;
  vsd_vsu_signaturedate: Date;
  vsd_signature: string;
  vsd_vsu_declarationsignature: string;
}
export interface iCRMInvoiceLineDetail {
  vsd_vsu_expensetype: number;

  vsd_vsu_transportationtype?: number;
  vsd_vsu_mileage?: number;
  vsd_amountsimple?: number;

  vsd_vsu_other?: string;
  vsd_vsu_number?: number;
  vsd_vsu_dailyroomrate?: number;

  vsd_vsu_childage?: number;
  vsd_vsu_childcarestartdate?: Date;
  vsd_vsu_childcareenddate?: Date;
  vsd_vsu_childcareproviderfirstname?: string;
  vsd_childcareproviderlastname?: string;
  vsd_vsu_childcareproviderphoneno?: string;
}
