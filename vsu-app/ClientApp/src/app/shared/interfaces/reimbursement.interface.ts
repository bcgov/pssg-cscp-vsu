import { iAddress } from "./address.interface";

export interface iReimbursementForm {
    CaseInformation: iCaseInformation;
    TravelInformation: iTravelInformation;
    AuthorizationInformation: iAuthorizationInformation;
}

export interface iCaseInformation {
    incidentid: string;
}

export interface iTravelInformation {
    hasContactInfoChanged: boolean;
    contactInfoComments: string;
    travelDates: iiTravelDate[];
    transportationExpenses: iTravelExpense[];
    transportationTotal: number;
    accommodationExpenses: iAccommodationExpense[];
    accommodationTotal: number;
    mealExpenses: iMealExpense[];
    mealTotal: number;
    otherExpenses: iOtherExpense[];
    otherTotal: number;
    didYouPayChildcareExpenses: boolean;
    children: iChild[];
    subTotal: number;

    travelAdvanceAlreadyPaid: string;
    totalReimbursementClaim: number;

}

export interface iiTravelDate {
    purposeOfTravel: string;
    travelPeriodStart: Date
    startTime: string;
    startAMPM: string;
    travelPeriodEnd: Date;
    endTime: string;
    endAMPM: string;
}

export interface iTravelExpense {
    type: number;
    amount: number;
    mileage: number;
}

export interface iAccommodationExpense {
    type: string;
    numberOfNights: number;
    totalExpenses: number;
}

export interface iMealExpense {
    date: number;
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
}

export interface iOtherExpense {
    description: string;
    amount: number;
}

export interface iChild {
    age: number;
    startDate: Date;
    endDate: Date;
    firstName: string;
    lastName: string;
    phone: string;
    address: iAddress;
    childcareProviderGSTNumber: string;
    amountPaid: number;
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