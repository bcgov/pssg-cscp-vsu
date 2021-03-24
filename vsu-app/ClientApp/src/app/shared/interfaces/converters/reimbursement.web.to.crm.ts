import * as _ from 'lodash';
import { EnumHelper } from '../../enums-list';
import { iCRMDocument, iCRMTravelInfo } from '../dynamics/crm-application';
import { iCRMInvoiceLineDetail, iInvoice, iReimbursementFormCRM } from "../dynamics/crm-reimbursement";
import { iReimbursementForm } from "../reimbursement.interface";

export function convertReimbursementFormToCRM(data: iReimbursementForm) {
    console.log("converting reimbursement form");
    console.log(data);

    let crm_application: iReimbursementFormCRM = {
        CaseId: getCRMCase(data),
        ContactInfoComments: data.TravelInformation.contactInfoComments,
        Invoice: getInvoice(data),
    }

    let travelInfo = getCRMTravelInfoCollection(data);
    if (travelInfo.length > 0) crm_application.TravelInfoCollection = travelInfo;

    let travelExpenseInfo = getCRMTravelExpenseCollection(data);
    if (travelExpenseInfo.length > 0) crm_application.TransportationExpenseCollection = travelExpenseInfo;

    let accommodationInfo = getCRMAccommodationExpenseCollection(data);
    if (accommodationInfo.length > 0) crm_application.AccommodationExpenseCollection = accommodationInfo;

    let mealInfo = getCRMMealExpenseCollection(data);
    if (mealInfo.length > 0) crm_application.MealExpenseCollection = mealInfo;

    let childInfo = getCRMChildcareExpenseCollection(data);
    if (childInfo.length > 0) crm_application.ChildcareExpenseCollection = childInfo;

    let otherInfo = getCRMOtherExpenseCollection(data);
    if (otherInfo.length > 0) crm_application.OtherExpenseCollection = otherInfo;

    let documents = getCRMDocuments(data);
    if (documents.length > 0) crm_application.DocumentCollection = documents;

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
        //  not an empty obj       AND    Type has been selected                  AND  a valid amount is entered
        if (checkObjectHasValue(t) && t.type != enums.TransportationType.NONE.val && (t.mileage || t.amount)) {
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
        }
    });

    return travel_expense_collection;
}

function getCRMAccommodationExpenseCollection(data: iReimbursementForm) {
    let accommodation_expense_collection: iCRMInvoiceLineDetail[] = [];
    let enums = new EnumHelper();

    data.TravelInformation.accommodationExpenses.forEach(a => {
        if (checkObjectHasValue(a)) {
            accommodation_expense_collection.push({
                vsd_vsu_expensetype: enums.TravelExpenseType.Accommodation.val,
                vsd_vsu_other: a.type,
                vsd_vsu_number: Number(a.numberOfNights),
                vsd_vsu_dailyroomrate: Number(a.roomRate),
                vsd_amountsimple: Number(a.numberOfNights) * Number(a.roomRate),
            });
        }
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
        if (checkObjectHasValue(o)) {
            other_expense_collection.push({
                vsd_vsu_expensetype: enums.TravelExpenseType.Other.val,
                vsd_vsu_other: o.description,
                vsd_amountsimple: Number(o.amount),
            });
        }
    });

    return other_expense_collection;
}

function getCRMDocuments(data: iReimbursementForm) {
    let documents: iCRMDocument[] = [];

    data.AuthorizationInformation.documents.forEach(d => {
        if (checkObjectHasValue(d)) {
            documents.push({
                filename: d.filename,
                body: d.body,
                subject: d.subject,
            });
        }
    });

    return documents;
}

function checkObjectHasValue(obj: any) {
    return Object.values(obj).some(value => !!value);
}