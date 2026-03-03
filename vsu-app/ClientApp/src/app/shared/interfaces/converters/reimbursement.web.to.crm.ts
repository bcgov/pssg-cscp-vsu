import { DocumentDto, InvoiceDto, InvoiceLineItemDto, ReimbursementCaseDto, TravelInfoDto } from '../../../../model';
import { EnumHelper } from '../../enums-list';
import { iReimbursementForm } from '../reimbursement.interface';

export function convertReimbursementFormToCRM(data: iReimbursementForm): ReimbursementCaseDto {
  let crm_application: ReimbursementCaseDto = {
    caseId: getCRMCase(data),
    contactInfoComments: data.TravelInformation.contactInfoComments,
    invoice: getInvoice(data)
  };

  let travelInfo = getCRMTravelInfoCollection(data);
  if (travelInfo.length > 0) crm_application.travelInfoCollection = travelInfo;

  let travelExpenseInfo = getCRMTravelExpenseCollection(data);
  if (travelExpenseInfo.length > 0) crm_application.transportationExpenseCollection = travelExpenseInfo;

  let accommodationInfo = getCRMAccommodationExpenseCollection(data);
  if (accommodationInfo.length > 0) crm_application.accommodationExpenseCollection = accommodationInfo;

  let mealInfo = getCRMMealExpenseCollection(data);
  if (mealInfo.length > 0) crm_application.mealExpenseCollection = mealInfo;

  let childInfo = getCRMChildcareExpenseCollection(data);
  if (childInfo.length > 0) crm_application.childcareExpenseCollection = childInfo;

  let otherInfo = getCRMOtherExpenseCollection(data);
  if (otherInfo.length > 0) crm_application.otherExpenseCollection = otherInfo;

  let documents = getCRMDocuments(data);
  if (documents.length > 0) crm_application.documentCollection = documents;

  return crm_application;
}

function getCRMCase(data: iReimbursementForm) {
  return { incidentId: data.CaseInformation.incidentId };
}

function getInvoice(data: iReimbursementForm): InvoiceDto {
  let enums = new EnumHelper();
  let invoice: InvoiceDto = {
    claimantContactInfoChanged: data.TravelInformation.hasContactInfoChanged
      ? enums.Boolean.True.val
      : enums.Boolean.False.val,
    signatureDate: data.AuthorizationInformation.date?.toISOString(),
    signature: data.AuthorizationInformation.fullName,
    declarationSignature: data.AuthorizationInformation.signature
  };
  return invoice;
}

function getCRMTravelInfoCollection(data: iReimbursementForm): TravelInfoDto[] {
  let travel_collection: TravelInfoDto[] = [];

  data.TravelInformation.travelDates.forEach((t) => {
    travel_collection.push({
      purposeOfTravel: t.purposeOfTravel,
      travelPeriodFrom: t.travelPeriodStart?.toISOString(),
      travelPeriodTo: t.travelPeriodEnd?.toISOString()
    });
  });

  return travel_collection;
}

function getCRMTravelExpenseCollection(data: iReimbursementForm): InvoiceLineItemDto[] {
  let travel_expense_collection: InvoiceLineItemDto[] = [];
  let enums = new EnumHelper();

  data.TravelInformation.transportationExpenses.forEach((t) => {
    //  not an empty obj       AND    Type has been selected                  AND  a valid amount is entered
    if (checkObjectHasValue(t) && t.type != enums.TransportationType.NONE.val && (t.mileage || t.amount)) {
      let expense: InvoiceLineItemDto = {
        expenseType: enums.TravelExpenseType.Transportation.val,
        transportationType: Number(t.type)
      };
      if (t.type == enums.TransportationType.Mileage.val) {
        expense.mileage = Number(t.mileage);
      } else {
        expense.amount = Number(t.amount);
      }
      travel_expense_collection.push(expense);
    }
  });

  return travel_expense_collection;
}

function getCRMAccommodationExpenseCollection(data: iReimbursementForm): InvoiceLineItemDto[] {
  let accommodation_expense_collection: InvoiceLineItemDto[] = [];
  let enums = new EnumHelper();

  data.TravelInformation.accommodationExpenses.forEach((a) => {
    if (checkObjectHasValue(a)) {
      accommodation_expense_collection.push({
        expenseType: enums.TravelExpenseType.Accommodation.val,
        other: a.type,
        number: Number(a.numberOfNights),
        dailyRoomRate: Number(a.roomRate),
        amount: Number(a.numberOfNights) * Number(a.roomRate)
      });
    }
  });

  return accommodation_expense_collection;
}

function getCRMMealExpenseCollection(data: iReimbursementForm): InvoiceLineItemDto[] {
  let meal_expense_collection: InvoiceLineItemDto[] = [];
  let enums = new EnumHelper();

  //Meal date doesn't have a field in COAST atm
  data.TravelInformation.mealExpenses.forEach((m) => {
    if (m.breakfast > 0) {
      meal_expense_collection.push({
        expenseType: enums.TravelExpenseType.Meal_Breakfast.val,
        number: Number(m.breakfast)
      });
    }

    if (m.lunch > 0) {
      meal_expense_collection.push({
        expenseType: enums.TravelExpenseType.Meal_Lunch.val,
        number: Number(m.lunch)
      });
    }

    if (m.dinner > 0) {
      meal_expense_collection.push({
        expenseType: enums.TravelExpenseType.Meal_Dinner.val,
        number: Number(m.dinner)
      });
    }
  });

  return meal_expense_collection;
}

function getCRMChildcareExpenseCollection(data: iReimbursementForm): InvoiceLineItemDto[] {
  let child_care_expense_collection: InvoiceLineItemDto[] = [];
  let enums = new EnumHelper();

  data.TravelInformation.children.forEach((c) => {
    child_care_expense_collection.push({
      expenseType: enums.TravelExpenseType.Childcare.val,
      childAge: Number(c.age),
      childcareStartDate: c.startDate?.toISOString(),
      childcareEndDate: c.endDate?.toISOString(),
      childcareProviderFirstName: c.firstName,
      childcareProviderLastName: c.lastName,
      childcareProviderPhoneNo: c.phone,
      amount: Number(c.amountPaid)
    });
  });

  return child_care_expense_collection;
}

function getCRMOtherExpenseCollection(data: iReimbursementForm): InvoiceLineItemDto[] {
  let other_expense_collection: InvoiceLineItemDto[] = [];
  let enums = new EnumHelper();

  data.TravelInformation.otherExpenses.forEach((o) => {
    if (checkObjectHasValue(o)) {
      other_expense_collection.push({
        expenseType: enums.TravelExpenseType.Other.val,
        other: o.description,
        amount: Number(o.amount)
      });
    }
  });

  return other_expense_collection;
}

function getCRMDocuments(data: iReimbursementForm): DocumentDto[] {
  let documents: DocumentDto[] = [];

  data.AuthorizationInformation.documents.forEach((d) => {
    if (checkObjectHasValue(d)) {
      documents.push({
        fileName: d.filename,
        body: d.body,
        subject: d.subject
      });
    }
  });

  return documents;
}

function checkObjectHasValue(obj: any) {
  return Object.values(obj).some((value) => !!value);
}
