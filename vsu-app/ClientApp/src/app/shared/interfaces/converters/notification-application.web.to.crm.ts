import { ApplicationType, EnumHelper } from "../../enums-list";
import { iCRMApplication, iCRMCourtInfo, iCRMParticipant, iApplicationFormCRM } from "../dynamics/crm-application";
import { iNotificationApplication } from "../application.interface";

export function convertNotificationApplicationToCRM(application: iNotificationApplication) {
    console.log("converting notification application");
    console.log(application);

    let crm_application: iApplicationFormCRM = {
        Application: getCRMApplication(application),
        CourtInfoCollection: getCRMCourtInfoCollection(application),
        PoliceFileNumberCollection: [],
        ProviderCollection: getCRMProviderCollection(application),
        DocumentCollection: [],
        TravelInfoCollection: [],
    }

    return crm_application;
}

function getCRMApplication(application: iNotificationApplication) {
    let enums = new EnumHelper();
    let crm_application: iCRMApplication = {
        vsd_vsu_applicationtype: ApplicationType.NOTIFICATION,
        vsd_cvap_victimfirstname: application.CaseInformation.firstName,
        vsd_cvap_victimmiddlename: application.CaseInformation.middleName,
        vsd_cvap_victimlastname: application.CaseInformation.lastName,
        vsd_cvap_victimbirthdate: application.CaseInformation.birthDate,
        vsd_cvap_victimgendercode: application.CaseInformation.gender,

        vsd_vsu_applicanttype: application.ApplicantInformation.applicantType,
        vsd_vsuapplicanttypeother: application.ApplicantInformation.applicantTypeOther,
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

        vsd_vsu_notificationto: application.RecipientDetails.notificationRecipient,
        vsd_vsu_significantcourtupdates: application.RecipientDetails.courtUpdates ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_finalcourtresults: application.RecipientDetails.courtResults ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_updatesonallcriminalcourtappearances: application.RecipientDetails.courtAppearances ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_criminalcourtordersissued: application.RecipientDetails.courtOrders ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_bccorrectionsinformation: application.RecipientDetails.correctionsInformation ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_notificationadditionalcomments: application.RecipientDetails.additionalComments,

        vsd_vsu_infosharecscpbc: application.AuthorizationInformation.registerForVictimNotification ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_infosharevsu: application.AuthorizationInformation.permissionToShareContactInfo ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_vsu_infosharevsw: application.AuthorizationInformation.permissionToContactMyVSW ? enums.Boolean.True.val : enums.Boolean.False.val,
        vsd_declarationverified: application.AuthorizationInformation.declaration ? enums.Boolean.True.val : enums.Boolean.False.val,

        vsd_declarationfullname: application.AuthorizationInformation.fullName,
        vsd_declarationdate: application.AuthorizationInformation.date,
        vsd_applicantssignature: application.AuthorizationInformation.signature,
    };
    return crm_application;
}
function getCRMCourtInfoCollection(application: iNotificationApplication) {
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

function getCRMProviderCollection(application: iNotificationApplication) {
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

    //Designate
    if (application.RecipientDetails.designate) {
        application.RecipientDetails.designate.forEach(designate => {
            provider_collection.push({
                vsd_firstname: designate.firstName,
                vsd_middlename: designate.middleName,
                vsd_lastname: designate.lastName,
                vsd_addressline1: designate.address.line1,
                vsd_addressline2: designate.address.line2,
                vsd_city: designate.address.city,
                vsd_province: designate.address.province,
                vsd_postalcode: designate.address.postalCode,
                vsd_relationship1: "Designate",
                vsd_relationship1other: "",

                vsd_relationship2: designate.relationship ? "Other" : "",
                vsd_relationship2other: designate.relationship,

                vsd_vsu_oktosendmail: designate.mayWeSendCorrespondence,

                vsd_vsu_methodofcontact1type: designate.contactMethods[0].val ? designate.contactMethods[0].type : null,
                vsd_vsu_methodofcontact1number: designate.contactMethods[0].val ? designate.contactMethods[0].val : null,
                vsd_vsu_methodofcontact1leavedetailedmessage: designate.contactMethods[0].val ? designate.contactMethods[0].leaveMessage : null,
                vsd_vsu_methodofcontact2type: designate.contactMethods[1].val ? designate.contactMethods[1].type : null,
                vsd_vsu_methodofcontact2number: designate.contactMethods[1].val ? designate.contactMethods[1].val : null,
                vsd_vsu_methodofcontact2leavedetailedmessage: designate.contactMethods[1].val ? designate.contactMethods[1].leaveMessage : null,
                vsd_vsu_methodofcontact3type: designate.contactMethods[2].val ? designate.contactMethods[2].type : null,
                vsd_vsu_methodofcontact3number: designate.contactMethods[2].val ? designate.contactMethods[2].val : null,
                vsd_vsu_methodofcontact3leavedetailedmessage: designate.contactMethods[2].val ? designate.contactMethods[2].leaveMessage : null,
            });
        });
    }

    //Victim Service Worker
    if (application.RecipientDetails.victimServiceWorker) {
        application.RecipientDetails.victimServiceWorker.forEach(vsw => {
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
        });
    }

    return provider_collection;
}
