import { ApplicationType, EnumHelper } from "../../enums-list";
import { iCRMApplication, iCRMCourtInfo, iCRMParticipant, iApplicationFormCRM, iCRMOffence, iCRMTravelInfo } from "../dynamics/crm-application";
import { iTravelFundApplication } from "../application.interface";
import * as _ from 'lodash';

export function convertTravelFundApplicationToCRM(application: iTravelFundApplication) {
    console.log("converting travel application");
    console.log(application);

    console.log("TODO - need fields add/updated in COAST to capture form. Check TODO comments for details");

    let crm_application: iApplicationFormCRM = {
        Application: getCRMApplication(application),
        CourtInfoCollection: getCRMCourtInfoCollection(application),
        DocumentCollection: [],
        OffenceCollection: getOffenceInfo(application),
        PoliceFileNumberCollection: [],
        ProviderCollection: getCRMProviderCollection(application),
        TravelInfoCollection: getCRMTravelInfoCollection(application),
    }

    return crm_application;
}

function getCRMApplication(application: iTravelFundApplication) {
    let enums = new EnumHelper();

    let temp: any = null;

    //TODO - need fields in dynamics to capture these
    temp = application.OverviewInformation.offencesComment;
    temp = application.OverviewInformation.proceedingsImpactOutcome;
    temp = application.OverviewInformation.proceedingsImpactOutcomeComment;
    temp = application.OverviewInformation.travelMoreThan100KM;
    temp = application.OverviewInformation.travelMoreThan100KMComment;
    temp = application.OverviewInformation.notCoveredByOtherSources;
    temp = application.OverviewInformation.notCoveredByOtherSourcesComment;
    temp = application.OverviewInformation.additionalComments;


    let relationship_to_victim = "";
    if (application.ApplicantInformation.applicantType === enums.ApplicantType.Support_Person.val) {
        relationship_to_victim = application.ApplicantInformation.supportPersonRelationship;
    }
    else if (application.ApplicantInformation.applicantType === enums.ApplicantType.Immediate_Family_Member.val) {
        relationship_to_victim = application.ApplicantInformation.IFMRelationship;
    }
    else if (application.ApplicantInformation.applicantType === enums.ApplicantType.Victim_Service_Worker.val && application.ApplicantInformation.victimServiceWorker.length > 0) {
        //TODO - need fields in dynamics to capture vsw info (labled as Manager name on the webform)
        temp = application.ApplicantInformation.vswComment;
        temp = application.ApplicantInformation.coveredByVictimServiceProgram;
        temp = application.ApplicantInformation.coveredByVictimServiceProgramComment;

        temp = application.ApplicantInformation.victimServiceWorker[0].firstName;
        temp = application.ApplicantInformation.victimServiceWorker[0].lastName;
        temp = application.ApplicantInformation.victimServiceWorker[0].organization;
        temp = application.ApplicantInformation.victimServiceWorker[0].telephone;
        temp = application.ApplicantInformation.victimServiceWorker[0].email;
    }

    let crm_application: iCRMApplication = {
        vsd_vsu_applicationtype: ApplicationType.TRAVEL_FUNDS,
        vsd_vsu_applicanttype: application.ApplicantInformation.applicantType,
        vsd_cvap_relationshiptovictim: relationship_to_victim,

        vsd_vsu_victimtravelfundapplicationsubmitted: application.ApplicantInformation.victimAlreadySubmitted,
        vsd_vsu_vtfappsubmittedunknowncomments: application.ApplicantInformation.victimAlreadySubmittedComment,

        vsd_vsu_otherfamilymembersapplyingtovtf: application.ApplicantInformation.otherFamilyAlsoApplying,
        vsd_vsu_otherfamilymembersvtfothercomments: application.ApplicantInformation.otherFamilyAlsoApplyingComment,

        vsd_applicantsfirstname: application.ApplicantInformation.firstName,
        vsd_applicantsmiddlename: application.ApplicantInformation.middleName,
        vsd_applicantslastname: application.ApplicantInformation.lastName,
        vsd_otherfirstname: "",
        vsd_otherlastname: "",
        vsd_dateofnamechange: null,
        vsd_applicantsgendercode: application.ApplicantInformation.gender,
        vsd_applicantsbirthdate: application.ApplicantInformation.birthDate,
        vsd_applicantsmaritalstatus: 0,

        vsd_applicantspreferredlanguage: application.ApplicantInformation.preferredLanguage,
        vsd_applicantsinterpreterneeded: application.ApplicantInformation.interpreterNeeded,
        vsd_applicantsprimaryaddressline1: application.ApplicantInformation.address.line1,
        vsd_applicantsprimaryaddressline2: application.ApplicantInformation.address.line2,
        vsd_applicantsprimarycity: application.ApplicantInformation.address.city,
        vsd_applicantsprimaryprovince: application.ApplicantInformation.address.province,
        vsd_applicantsprimarycountry: application.ApplicantInformation.address.country,
        vsd_applicantsprimarypostalcode: application.ApplicantInformation.address.postalCode,
        vsd_vsu_oktosendmail: application.ApplicantInformation.mayWeSendCorrespondence,

        //check if we set these - don't send any info if val is blank
        vsd_vsu_methodofcontact1type: application.ApplicantInformation.contactMethods[0].val ? application.ApplicantInformation.contactMethods[0].type : null,
        vsd_vsu_methodofcontact1number: application.ApplicantInformation.contactMethods[0].val ? application.ApplicantInformation.contactMethods[0].val : null,
        vsd_vsu_methodofcontact1leavedetailedmessage: application.ApplicantInformation.contactMethods[0].val ? application.ApplicantInformation.contactMethods[0].leaveMessage : null,
        vsd_vsu_methodofcontact2type: application.ApplicantInformation.contactMethods[1].val ? application.ApplicantInformation.contactMethods[1].type : null,
        vsd_vsu_methodofcontact2number: application.ApplicantInformation.contactMethods[1].val ? application.ApplicantInformation.contactMethods[1].val : null,
        vsd_vsu_methodofcontact2leavedetailedmessage: application.ApplicantInformation.contactMethods[1].val ? application.ApplicantInformation.contactMethods[1].leaveMessage : null,
        vsd_vsu_methodofcontact3type: application.ApplicantInformation.contactMethods[2].val ? application.ApplicantInformation.contactMethods[2].type : null,
        vsd_vsu_methodofcontact3number: application.ApplicantInformation.contactMethods[2].val ? application.ApplicantInformation.contactMethods[2].val : null,
        vsd_vsu_methodofcontact3leavedetailedmessage: application.ApplicantInformation.contactMethods[2].val ? application.ApplicantInformation.contactMethods[2].leaveMessage : null,

        vsd_cvap_victimfirstname: application.CaseInformation.firstName,
        vsd_cvap_victimmiddlename: application.CaseInformation.middleName,
        vsd_cvap_victimlastname: application.CaseInformation.lastName,
        vsd_cvap_victimbirthdate: application.CaseInformation.birthDate,
        vsd_cvap_victimgendercode: application.CaseInformation.gender,


        vsd_vsu_travelexpenserequest_03: "",
        vsd_vsu_travelexpenserequesttransportother: "",
        vsd_vsu_travelexpenserequestother: application.TravelInformation.expenses.applyForOtherText,
        // vsd_vsu_purposeoftravel: application.TravelInformation.purposeOfTravel,
        // vsd_vsu_travelperiodfrom: application.TravelInformation.travelPeriodStart,
        // vsd_vsu_travelperiodto: application.TravelInformation.travelPeriodEnd,
        vsd_vsu_additionaltravelcomments: application.TravelInformation.additionalComments,


        vsd_declarationverified: application.AuthorizationInformation.declaration ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_declarationfullname: application.AuthorizationInformation.fullName,
        vsd_declarationdate: application.AuthorizationInformation.date,
        vsd_applicantssignature: application.AuthorizationInformation.signature,
    };

    if (application.CaseInformation.victimServiceWorker.length > 0) {
        crm_application.vsd_vsu_discussvtfappwithvsp = application.CaseInformation.victimServiceWorker[0].okToDiscussTravel;
    }

    let requested_expenses = [];

    if (application.TravelInformation.expenses.applyForAccommodation) {
        requested_expenses.push(enums.TravelExpenses.Accommodation.val);
    }

    if (application.TravelInformation.expenses.applyForTransportationBus) {
        requested_expenses.push(enums.TravelExpenses.TransportationBus.val);
    }

    if (application.TravelInformation.expenses.applyForTransportationFerry) {
        requested_expenses.push(enums.TravelExpenses.TransportationFerry.val);
    }

    if (application.TravelInformation.expenses.applyForTransportationFlights) {
        requested_expenses.push(enums.TravelExpenses.TransportationFlights.val);
    }

    if (application.TravelInformation.expenses.applyForTransportationMileage) {
        requested_expenses.push(enums.TravelExpenses.TransportationMileage.val);
    }

    if (application.TravelInformation.expenses.applyForTransportationOther) {
        requested_expenses.push(enums.TravelExpenses.TransportationOther.val);
        crm_application.vsd_vsu_travelexpenserequesttransportother = application.TravelInformation.expenses.applyForTransportationOtherText;
    }

    if (application.TravelInformation.expenses.applyForMeals) {
        requested_expenses.push(enums.TravelExpenses.Meals.val);
    }

    if (application.TravelInformation.expenses.applyForOther) {
        requested_expenses.push(enums.TravelExpenses.Other.val);
    }

    crm_application.vsd_vsu_travelexpenserequest_03 = requested_expenses.join(',');

    return crm_application;
}
function getCRMCourtInfoCollection(application: iTravelFundApplication) {
    let court_info_collection: iCRMCourtInfo[] = [];

    if (application.CaseInformation.courtInfo) {
        application.CaseInformation.courtInfo.forEach(court_info => {
            court_info_collection.push({
                vsd_courtfilenumber: court_info.courtFileNumber,
                vsd_courtlocation: court_info.courtLocation
            });
        });
    }

    return court_info_collection;
}

function getOffenceInfo(application: iTravelFundApplication) {
    let offence_collection: iCRMOffence[] = [];
    offence_collection = application.CaseInformation.offences.filter(o => o.checked).map(o => { return { vsd_offenseid: o.id } });
    return offence_collection;
}

function getCRMTravelInfoCollection(application: iTravelFundApplication) {
    let travel_collection: iCRMTravelInfo[] = [];
    let courtFileNumber = "";
    if (application.CaseInformation.courtInfo.length > 0) {
        courtFileNumber = application.CaseInformation.courtInfo[0].courtFileNumber;
    }

    application.TravelInformation.courtDates.forEach(c => {
        travel_collection.push({
            vsd_courtdate: c.courtDate,
            vsd_courtfilenumber_text: courtFileNumber,
            vsd_purposeoftravel: c.purposeOfTravel,
            vsd_travelperiodfrom: c.travelPeriodStart,
            vsd_travelperiodto: c.travelPeriodEnd
        });
    })

    return travel_collection;
}

function getCRMProviderCollection(application: iTravelFundApplication) {
    let provider_collection: iCRMParticipant[] = [];

    //CaseInformation Accused / Offender
    provider_collection.push({
        vsd_firstname: application.CaseInformation.accusedFirstName,
        vsd_middlename: application.CaseInformation.accusedMiddleName,
        vsd_lastname: application.CaseInformation.accusedLastName,
        vsd_birthdate: application.CaseInformation.accusedBirthDate,
        vsd_gender: application.CaseInformation.accusedGender,
        vsd_relationship1: "Subject",
    });

    //CaseInformation Additional Accused
    application.CaseInformation.additionalAccused.forEach(accused => {
        provider_collection.push({
            vsd_firstname: accused.firstName,
            vsd_middlename: accused.middleName,
            vsd_lastname: accused.lastName,
            vsd_birthdate: accused.birthDate,
            vsd_gender: accused.gender,
            vsd_relationship1: "Subject",
        });
    });

    //Crown Counsel
    if (application.CaseInformation.crownCounsel) {
        application.CaseInformation.crownCounsel.forEach(cc => {
            if (checkObjectHasValue(cc)) {
                provider_collection.push({
                    vsd_firstname: cc.firstName,
                    vsd_lastname: cc.lastName,
                    vsd_phonenumber: cc.telephone,
                    vsd_relationship1: "Crown Counsel",
                    vsd_relationship1other: "",
                });
            }
        });
    }

    //Victim Service Worker
    if (application.CaseInformation.victimServiceWorker) {
        application.CaseInformation.victimServiceWorker.forEach(vsw => {
            let testVSW = _.cloneDeep(vsw);
            delete testVSW["okToDiscussTravel"];
            if (checkObjectHasValue(testVSW)) {
                provider_collection.push({
                    vsd_firstname: vsw.firstName,
                    vsd_lastname: vsw.lastName,
                    vsd_companyname: vsw.organization,
                    vsd_phonenumber: vsw.telephone,
                    vsd_mainphoneextension: vsw.extension,
                    vsd_city: vsw.city,
                    vsd_email: vsw.email,
                    vsd_relationship1: "Victim Services Worker",
                    vsd_relationship1other: "",
                });
            }
        });
    }

    return provider_collection;
}

function checkObjectHasValue(obj: any) {
    return Object.values(obj).some(value => !!value);
}
