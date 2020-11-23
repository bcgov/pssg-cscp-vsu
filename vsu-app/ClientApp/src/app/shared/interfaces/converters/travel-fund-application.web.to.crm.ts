import { ApplicationType, EnumHelper } from "../../enums-list";
import { iCRMApplication, iCRMCourtInfo, iCRMParticipant, iApplicationFormCRM, iCRMOffence } from "../dynamics/crm-application";
import { iTravelFundApplication } from "../application.interface";
import * as _ from 'lodash';

export function convertTravelFundApplicationToCRM(application: iTravelFundApplication) {
    console.log("converting travel application");
    console.log(application);

    console.log("TODO - need to capture Travel Info -> Court Dates");

    let crm_application: iApplicationFormCRM = {
        Application: getCRMApplication(application),
        CourtInfoCollection: getCRMCourtInfoCollection(application),
        DocumentCollection: [],
        OffenceCollection: getOffenceInfo(application),
        PoliceFileNumberCollection: [],
        ProviderCollection: getCRMProviderCollection(application),
    }

    return crm_application;
}

function getCRMApplication(application: iTravelFundApplication) {
    let enums = new EnumHelper();
    let relationship_to_victim = "";
    if (application.ApplicantInformation.applicantType === enums.ApplicantType.Support_Person.val) {
        relationship_to_victim = application.ApplicantInformation.supportPersonRelationship;
    }
    else if (application.ApplicantInformation.applicantType === enums.ApplicantType.Immediate_Family_Member.val) {
        relationship_to_victim = application.ApplicantInformation.IFMRelationship;
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


        vsd_vsu_vsutravelexpenserequest: "",
        vsd_vsu_travelexpenserequesttransportother: "",
        vsd_vsu_travelexpenserequestother: application.TravelInformation.applyForOtherText,
        vsd_vsu_purposeoftravel: application.TravelInformation.purposeOfTravel,
        vsd_vsu_travelperiodfrom: application.TravelInformation.travelPeriodStart,
        vsd_vsu_travelperiodto: application.TravelInformation.travelPeriodEnd,
        vsd_vsu_additionaltravelcomments: application.TravelInformation.additionalComments,


        vsd_declarationverified: application.AuthorizationInformation.declaration ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_declarationfullname: application.AuthorizationInformation.fullName,
        vsd_declarationdate: application.AuthorizationInformation.date,
        vsd_applicantssignature: application.AuthorizationInformation.signature,
    };

    let requested_expenses = [];

    if (application.TravelInformation.applyForTransportationBus) {
        requested_expenses.push("100000000");
    }

    if (application.TravelInformation.applyForTransportationFerry) {
        requested_expenses.push("100000001");
    }

    if (application.TravelInformation.applyForTransportationFlights) {
        requested_expenses.push("100000002");
    }

    if (application.TravelInformation.applyForTransportationMileage) {
        requested_expenses.push("100000003");
    }

    if (application.TravelInformation.applyForTransportationOther) {
        requested_expenses.push("100000004");
        crm_application.vsd_vsu_travelexpenserequesttransportother = application.TravelInformation.applyForTransportationOtherText;
    }

    if (application.TravelInformation.applyForMeals) {
        requested_expenses.push("100000005");
    }

    if (application.TravelInformation.applyForAccommodation) {
        requested_expenses.push("100000006");
    }

    if (application.TravelInformation.applyForOther) {
        requested_expenses.push("100000007");
    }

    crm_application.vsd_vsu_vsutravelexpenserequest = requested_expenses.join(',');


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

    if (application.CaseInformation.offence) {
        offence_collection.push({
            vsd_offenseid: application.CaseInformation.offence
        });
    }

    return offence_collection;
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
        if (accused.name) {
            provider_collection.push({
                vsd_name: accused.name,
                vsd_birthdate: accused.birthDate,
                vsd_gender: accused.gender,
                vsd_relationship1: "Subject",
            });
        }
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
