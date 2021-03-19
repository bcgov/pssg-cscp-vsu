import * as _ from 'lodash';
import { EnumHelper } from '../../enums-list';
import { iCRMTravelInfo } from '../dynamics/crm-application';
import { iCRMInvoiceLineDetail, iInvoice, iReimbursementFormCRM } from "../dynamics/crm-reimbursement";
import { iReimbursementForm } from "../reimbursement.interface";

export function convertReimbursementFormToCRM(data: iReimbursementForm) {
    console.log("converting reimbursement form");
    console.log(data);

    let crm_application: iReimbursementFormCRM = {
        CaseId: getCRMCase(data),
        ContactInfoComments: data.TravelInformation.contactInfoComments,
        Invoice: getInvoice(data),
        TravelInfoCollection: getCRMTravelInfoCollection(data),
        TransportationExpenseCollection: getCRMTravelExpenseCollection(data),
        AccommodationExpenseCollection: getCRMAccommodationExpenseCollection(data),
        MealExpenseCollection: getCRMMealExpenseCollection(data),
        ChildcareExpenseCollection: getCRMChildcareExpenseCollection(data),
        OtherExpenseCollection: getCRMOtherExpenseCollection(data),
    }

    return crm_application;
}

function getCRMCase(data: iReimbursementForm) {
    return { incidentid: data.CaseInformation.incidentid }
}

function getInvoice(data: iReimbursementForm) {
    let enums = new EnumHelper();
    let invoice: iInvoice = {
        vsd_vsu_claimantcontactinfochanged: data.TravelInformation.hasContactInfoChanged ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_signaturedate: data.AuthorizationInformation.date,
        vsd_signature: data.AuthorizationInformation.fullName,
        vsd_vsu_declarationsignature: data.AuthorizationInformation.signature,
    }
    return invoice;
}

function getCRMTravelInfoCollection(data: iReimbursementForm) {
    let travel_collection: iCRMTravelInfo[] = [];

    data.TravelInformation.travelDates.forEach(t => {
        travel_collection.push({
            vsd_purposeoftravel: t.purposeOfTravel,
            vsd_travelperiodfrom: t.travelPeriodStart,
            vsd_travelperiodto: t.travelPeriodEnd
        });
    });

    return travel_collection;
}

function getCRMTravelExpenseCollection(data: iReimbursementForm) {
    let travel_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    data.TravelInformation.transportationExpenses.forEach(t => {
        let expense: iCRMInvoiceLineDetail = {
            vsd_vsu_expensetype: enums.TravelExpenseType.Transportation.val,
            vsd_vsu_transportationtype: Number(t.type),
        };
        if (t.type == enums.TransportationType.Mileage.val) {
            expense.vsd_vsu_mileage = Number(t.mileage);
        }
        else {
            expense.vsd_amountsimple = Number(t.amount);
        }
        travel_expense_collection.push(expense);
    });

    return travel_expense_collection;
}

function getCRMAccommodationExpenseCollection(data: iReimbursementForm) {
    let accommodation_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    data.TravelInformation.accommodationExpenses.forEach(a => {
        accommodation_expense_collection.push({
            vsd_vsu_expensetype: enums.TravelExpenseType.Accommodation.val,
            vsd_vsu_other: a.type,
            vsd_vsu_number: Number(a.numberOfNights)
        });
    });

    return accommodation_expense_collection;
}

function getCRMMealExpenseCollection(data: iReimbursementForm) {
    let meal_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    //Meal date doesn't have a field in COAST atm
    data.TravelInformation.mealExpenses.forEach(m => {
        if (m.breakfast > 0) {
            meal_expense_collection.push({
                vsd_vsu_expensetype: enums.TravelExpenseType.Meal_Breakfast.val,
                vsd_vsu_number: Number(m.breakfast),
            });
        }

        if (m.lunch > 0) {
            meal_expense_collection.push({
                vsd_vsu_expensetype: enums.TravelExpenseType.Meal_Lunch.val,
                vsd_vsu_number: Number(m.lunch),
            });
        }

        if (m.dinner > 0) {
            meal_expense_collection.push({
                vsd_vsu_expensetype: enums.TravelExpenseType.Meal_Dinner.val,
                vsd_vsu_number: Number(m.dinner),
            });
        }
    });

    return meal_expense_collection;
}

function getCRMChildcareExpenseCollection(data: iReimbursementForm) {
    let child_care_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    data.TravelInformation.children.forEach(c => {
        child_care_expense_collection.push({
            vsd_vsu_expensetype: enums.TravelExpenseType.Childcare.val,
            vsd_vsu_childage: Number(c.age),
            vsd_vsu_childcarestartdate: c.startDate,
            vsd_vsu_childcareenddate: c.endDate,
            vsd_vsu_childcareproviderfirstname: c.firstName,
            vsd_childcareproviderlastname: c.lastName,
            vsd_vsu_childcareproviderphoneno: c.phone,
            vsd_amountsimple: Number(c.amountPaid),
        });
    });

    return child_care_expense_collection;
}

function getCRMOtherExpenseCollection(data: iReimbursementForm) {
    let other_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    data.TravelInformation.otherExpenses.forEach(o => {
        other_expense_collection.push({
            vsd_vsu_expensetype: enums.TravelExpenseType.Other.val,
            vsd_vsu_other: o.description,
            vsd_amountsimple: Number(o.amount),
        });
    });

    return other_expense_collection;
}