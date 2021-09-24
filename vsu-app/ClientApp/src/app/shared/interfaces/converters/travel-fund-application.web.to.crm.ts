import { ApplicationType, EnumHelper, PARTICIPANT_TYPES } from "../../enums-list";
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

    let relationship_to_victim = "";
    if (application.ApplicantInformation.applicantType === enums.ApplicantType.Support_Person.val) {
        relationship_to_victim = application.ApplicantInformation.supportPersonRelationship;
    }
    else if (application.ApplicantInformation.applicantType === enums.ApplicantType.Immediate_Family_Member.val) {
        relationship_to_victim = application.ApplicantInformation.IFMRelationship;
    }

    let crm_application: iCRMApplication = {
        vsd_vsu_applicationtype: ApplicationType.TRAVEL_FUNDS,

        vsd_vsu_offencescomments: application.OverviewInformation.offencesComment,
        vsd_vsu_decision1impacttooutcome: application.OverviewInformation.proceedingsImpactOutcome,
        vsd_vsu_decision1comments: application.OverviewInformation.proceedingsImpactOutcomeComment,
        vsd_vsu_decision2travelover100km: application.OverviewInformation.travelMoreThan100KM,
        vsd_vsu_decision2comments: application.OverviewInformation.travelMoreThan100KMComment,
        vsd_vsu_decision3nootherfundingsource: application.OverviewInformation.notCoveredByOtherSources,
        vsd_vsu_decision3comments: application.OverviewInformation.notCoveredByOtherSourcesComment,
        vsd_vsu_additionalcomments: application.OverviewInformation.additionalComments,

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
        vsd_indigenous: application.ApplicantInformation.indigenousStatus,
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

    if (application.ApplicantInformation.applicantType === enums.ApplicantType.Victim_Service_Worker.val && application.ApplicantInformation.victimServiceWorker.length > 0) {
        //TODO - need fields in dynamics to capture vsw info (labled as Manager name on the webform)
        crm_application.vsd_vsu_vswcomments = application.ApplicantInformation.vswComment;
        crm_application.vsd_vsu_costscoveredbyvsp = application.ApplicantInformation.coveredByVictimServiceProgram;
        crm_application.vsd_vsu_vspcomments = application.ApplicantInformation.coveredByVictimServiceProgramComment;

        crm_application.vsd_vsu_managerfirstname = application.ApplicantInformation.victimServiceWorker[0].firstName;
        crm_application.vsd_vsu_managerlastname = application.ApplicantInformation.victimServiceWorker[0].lastName;
        crm_application.vsd_vsu_organizationagencyname = application.ApplicantInformation.victimServiceWorker[0].organization;
        crm_application.vsd_vsu_managerphone = application.ApplicantInformation.victimServiceWorker[0].telephone;
        crm_application.vsd_vsu_manageremail = application.ApplicantInformation.victimServiceWorker[0].email;
    }

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
    let enums = new EnumHelper();

    //CaseInformation Accused / Offender
    provider_collection.push({
        vsd_firstname: application.CaseInformation.accusedFirstName,
        vsd_middlename: application.CaseInformation.accusedMiddleName,
        vsd_lastname: application.CaseInformation.accusedLastName,
        vsd_birthdate: application.CaseInformation.accusedBirthDate,
        vsd_gender: application.CaseInformation.accusedGender,
        vsd_relationship1: PARTICIPANT_TYPES.ACCUSED,
        vsd_relationship2: application.CaseInformation.accusedRelationship,
    });

    //CaseInformation Additional Accused
    application.CaseInformation.additionalAccused.forEach(accused => {
        provider_collection.push({
            vsd_firstname: accused.firstName,
            vsd_middlename: accused.middleName,
            vsd_lastname: accused.lastName,
            vsd_birthdate: accused.birthDate,
            vsd_gender: accused.gender,
            vsd_relationship1: PARTICIPANT_TYPES.ACCUSED,
            vsd_relationship2: accused.relationship,
        });
    });

    //Crown Counsel
    if (application.CaseInformation.crownCounsel) {
        application.CaseInformation.crownCounsel.forEach(cc => {
            if (checkObjectHasValue(cc)) {
                provider_collection.push({
                    vsd_firstname: cc.firstName,
                    vsd_lastname: cc.lastName,
                    vsd_vsu_methodofcontact1type: cc.telephone ? enums.ContactType.Telephone.val : null,
                    vsd_vsu_methodofcontact1number: cc.telephone,
                    vsd_relationship1: PARTICIPANT_TYPES.CROWN_COUNSEL,
                    vsd_relationship1other: "",
                });
            }
        });
    }

    //Victim Service Worker
    if (application.CaseInformation.victimServiceWorker) {
        application.CaseInformation.victimServiceWorker.forEach(vsw => {
            //if any field besides okToDiscussTravel has data - we need to add this provider
            //otherwise we don't add a vsw provider
            let testVSW = _.cloneDeep(vsw);
            delete testVSW["okToDiscussTravel"];
            if (checkObjectHasValue(testVSW)) {
                provider_collection.push({
                    vsd_firstname: vsw.firstName,
                    vsd_lastname: vsw.lastName,
                    vsd_companyname: vsw.organization,
                    vsd_vsu_methodofcontact1type: vsw.telephone ? enums.ContactType.Telephone.val : null,
                    vsd_vsu_methodofcontact1number: vsw.telephone,
                    vsd_vsu_methodofcontact1ext: vsw.extension,
                    vsd_city: vsw.city,
                    vsd_vsu_methodofcontact2type: vsw.email ? enums.ContactType.Email.val : null,
                    vsd_vsu_methodofcontact2number: vsw.email,
                    vsd_relationship1: PARTICIPANT_TYPES.VICTIM_SERVICE_WORKER,
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
