import * as _ from 'lodash';
import { iCRMTravelInfo } from '../dynamics/crm-application';
import { iCRMInvoiceLineDetail, iInvoice, iReimbursementFormCRM } from "../dynamics/crm-reimbursement";
import { iReimbursementForm } from "../reimbursement.interface";

export function convertReimbursementFormToCRM(data: iReimbursementForm) {
    console.log("converting reimbursement form");
    console.log(data);

    let crm_application: iReimbursementFormCRM = {
        CaseId: getCRMCase(data),
        ContactInfoComments: "",
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
    let invoice: iInvoice = {
        vsd_vsu_claimantcontactinfochanged: data.TravelInformation.hasContactInfoChanged ? 1 : 0,
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
    })

    return travel_collection;
}

function getCRMTravelExpenseCollection(data: iReimbursementForm) {
    let travel_expense_collection: iCRMInvoiceLineDetail[] = [];

    data.TravelInformation.transportationExpenses.forEach(t => {
        travel_expense_collection.push({
            //t.ype is just a string - so problems
            vsd_vsu_expensetype: t.type,
            //also problems
            vsd_vsu_transportationtype: t.type,
            vsd_vsu_mileage: t.mileage,
            vsd_amountsimple: t.amount,
        });
    })

    return travel_expense_collection;
}

function getCRMAccommodationExpenseCollection(data: iReimbursementForm) {
    let accommodation_expense_collection: iCRMInvoiceLineDetail[] = [];

    data.TravelInformation.accommodationExpenses.forEach(a => {
        accommodation_expense_collection.push({
            //a.type is just a string description here - so no good
            vsd_vsu_expensetype: a.type,
            vsd_vsu_other: a.type.toString(),
            vsd_vsu_number: a.numberOfNights
        });
    })

    return accommodation_expense_collection;
}

function getCRMMealExpenseCollection(data: iReimbursementForm) {
    let meal_expense_collection: iCRMInvoiceLineDetail[] = [];

    data.TravelInformation.mealExpenses.forEach(m => {
        meal_expense_collection.push({
            vsd_vsu_expensetype: m.breakfast,
            vsd_vsu_number: m.dinner,
        });
    })

    return meal_expense_collection;
}

function getCRMChildcareExpenseCollection(data: iReimbursementForm) {
    let child_care_expense_collection: iCRMInvoiceLineDetail[] = [];

    data.TravelInformation.children.forEach(c => {
        child_care_expense_collection.push({
            vsd_vsu_expensetype: c.age,
            vsd_vsu_childage: c.age,
            vsd_vsu_childcarestartdate: c.startDate,
            vsd_vsu_childcareenddate: c.endDate,
            vsd_vsu_childcareproviderfirstname: c.firstName,
            vsd_childcareproviderlastname: c.lastName,
            vsd_vsu_childcareproviderphoneno: c.phone,
            vsd_amountsimple: c.amountPaid,
        });
    })

    return child_care_expense_collection;
}

function getCRMOtherExpenseCollection(data: iReimbursementForm) {
    let other_expense_collection: iCRMInvoiceLineDetail[] = [];

    data.TravelInformation.otherExpenses.forEach(o => {
        other_expense_collection.push({
            vsd_vsu_expensetype: o.amount,
            vsd_vsu_other: o.description,
            vsd_amountsimple: o.amount,
        });
    })

    return other_expense_collection;
}