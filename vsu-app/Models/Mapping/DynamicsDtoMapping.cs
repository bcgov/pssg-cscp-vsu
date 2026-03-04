using System;
using System.Linq;
using DataverseModel;
using Microsoft.Xrm.Sdk;
using Model;
using Models;

namespace Gov.Cscp.Victims.Public.Models.Mapping
{
    /// <summary>
    /// Extension methods for mapping DTOs to Dataverse request models
    /// </summary>
    public static class DynamicsDtoMapping
    {
        /// <summary>
        /// Maps a CheckCase model to a VSd_CheckVSuCaseRequest for Dataverse
        /// </summary>
        /// <param name="checkCase">The check case data from the API</param>
        /// <returns>A VSd_CheckVSuCaseRequest ready to be executed</returns>
        /// <exception cref="ArgumentNullException">Thrown when checkCase is null</exception>
        public static VSd_CheckVSuCaseRequest ToVSdCheckVSuCaseRequest(this CheckCaseDto checkCase)
        {
            if (checkCase == null)
            {
                throw new ArgumentNullException(nameof(checkCase));
            }

            return new VSd_CheckVSuCaseRequest
            {
                CaseNumber = checkCase.CaseNumber,
                FirstName = checkCase.FirstName,
                LastName = checkCase.LastName,
                Birthdate = checkCase.BirthDate ?? default(DateTime),
            };
        }

        /// <summary>
        /// Maps a ReimbursementCaseDto to a VSd_SubmitReimbursementInvoiceRequest for Dataverse
        /// </summary>
        /// <param name="reimbursement">The reimbursement case data from the API</param>
        /// <returns>A VSd_SubmitReimbursementInvoiceRequest ready to be executed</returns>
        /// <exception cref="ArgumentNullException">Thrown when reimbursement is null</exception>
        public static VSd_SubmitReimbursementInvoiceRequest ToVSdSubmitReimbursementInvoiceRequest(
            this ReimbursementCaseDto reimbursement
        )
        {
            if (reimbursement == null)
            {
                throw new ArgumentNullException(nameof(reimbursement));
            }

            var request = new VSd_SubmitReimbursementInvoiceRequest();

            // Map Case ID
            if (reimbursement.CaseId != null && !string.IsNullOrEmpty(reimbursement.CaseId.IncidentId))
            {
                request.CaseId = new EntityReference("incident", Guid.Parse(reimbursement.CaseId.IncidentId));
            }

            // Map Contact Info Comments
            request.ContactInfoComments = reimbursement.ContactInfoComments;

            // Map Invoice
            if (reimbursement.Invoice != null)
            {
                request.Invoice = reimbursement.Invoice.ToInvoiceEntity();
            }

            // Map Travel Info Collection
            if (reimbursement.TravelInfoCollection != null && reimbursement.TravelInfoCollection.Length > 0)
            {
                request.TravelInfoCollection = new EntityCollection(
                    reimbursement.TravelInfoCollection.Select(t => t.ToTravelInfoEntity()).ToList()
                );
            }

            // Map Transportation Expense Collection
            if (
                reimbursement.TransportationExpenseCollection != null
                && reimbursement.TransportationExpenseCollection.Length > 0
            )
            {
                request.TransportationExpenseCollection = new EntityCollection(
                    reimbursement.TransportationExpenseCollection.Select(e => e.ToInvoiceLineItemEntity()).ToList()
                );
            }

            // Map Accommodation Expense Collection
            if (
                reimbursement.AccommodationExpenseCollection != null
                && reimbursement.AccommodationExpenseCollection.Length > 0
            )
            {
                request.AccommodationExpenseCollection = new EntityCollection(
                    reimbursement.AccommodationExpenseCollection.Select(e => e.ToInvoiceLineItemEntity()).ToList()
                );
            }

            // Map Meal Expense Collection
            if (reimbursement.MealExpenseCollection != null && reimbursement.MealExpenseCollection.Length > 0)
            {
                request.MealExpenseCollection = new EntityCollection(
                    reimbursement.MealExpenseCollection.Select(e => e.ToInvoiceLineItemEntity()).ToList()
                );
            }

            // Map Childcare Expense Collection
            if (reimbursement.ChildcareExpenseCollection != null && reimbursement.ChildcareExpenseCollection.Length > 0)
            {
                request.ChildCareExpenseCollection = new EntityCollection(
                    reimbursement.ChildcareExpenseCollection.Select(e => e.ToInvoiceLineItemEntity()).ToList()
                );
            }

            // Map Other Expense Collection
            if (reimbursement.OtherExpenseCollection != null && reimbursement.OtherExpenseCollection.Length > 0)
            {
                request.OtherExpenseCollection = new EntityCollection(
                    reimbursement.OtherExpenseCollection.Select(e => e.ToInvoiceLineItemEntity()).ToList()
                );
            }

            // Map Document Collection
            if (reimbursement.DocumentCollection != null && reimbursement.DocumentCollection.Length > 0)
            {
                request.DocumentCollection = new EntityCollection(
                    reimbursement.DocumentCollection.Select(d => d.ToDocumentEntity()).ToList()
                );
            }

            return request;
        }

        #region Helper Methods

        /// <summary>
        /// Converts InvoiceDto to Dataverse Entity
        /// </summary>
        private static Entity ToInvoiceEntity(this InvoiceDto invoice)
        {
            var entity = new VSd_Invoice
            {
                VSd_VSu_ClaimantContactInfoChanged = invoice.ClaimantContactInfoChanged.HasValue
                    ? (VSd_YesNo?)invoice.ClaimantContactInfoChanged.Value
                    : null,
                VsD_VsU_SignaturedAte = invoice.SignatureDate,
                VSd_Signature = invoice.Signature,
                VSd_VSu_DeclarationSignature = invoice.DeclarationSignature,
            };

            return entity;
        }

        /// <summary>
        /// Converts TravelInfoDto to Dataverse Entity
        /// </summary>
        private static Entity ToTravelInfoEntity(this TravelInfoDto travelInfo)
        {
            var entity = new VSd_TravelInformation
            {
                VSd_CourtDate = travelInfo.vsd_courtdate,
                VSd_CourtFileNumber_Text = travelInfo.vsd_courtfilenumber_text,
                VSd_PurposeOfTravel = travelInfo.vsd_purposeoftravel,
                VSd_TravelPeriodFrom = travelInfo.vsd_travelperiodfrom,
                VSd_TravelPeriodTo = travelInfo.vsd_travelperiodto,
            };

            return entity;
        }

        /// <summary>
        /// Converts InvoiceLineItemDto to Dataverse Entity
        /// </summary>
        private static Entity ToInvoiceLineItemEntity(this InvoiceLineItemDto lineItem)
        {
            var entity = new VSd_InvoiceLineDetail
            {
                VSd_VSu_ExpenseType = lineItem.ExpenseType.HasValue
                    ? (VSd_InvoiceLineDetail_VSd_VSu_ExpenseType?)lineItem.ExpenseType.Value
                    : null,
                VSd_VSu_TransportationType = lineItem.TransportationType.HasValue
                    ? (VSd_VSu_TransportationType?)lineItem.TransportationType.Value
                    : null,
                VSd_VSu_Mileage = lineItem.Mileage.HasValue ? (decimal?)lineItem.Mileage.Value : null,
                VSd_AmountSimple = lineItem.Amount.HasValue ? new Money(lineItem.Amount.Value) : null,
                VSd_VSu_Other = lineItem.Other,
                VSd_VSu_Number = lineItem.Number,
                VSd_VSu_DailyRoomRate = lineItem.DailyRoomRate.HasValue
                    ? new Money(lineItem.DailyRoomRate.Value)
                    : null,
                VSd_VSu_ChildAge = lineItem.ChildAge,
                VSd_VSu_ChildCaRestartDate = lineItem.ChildcareStartDate,
                VSd_VSu_ChildCareEndDate = lineItem.ChildcareEndDate,
                VSd_VSu_ChildCareProviderFirstName = lineItem.ChildcareProviderFirstName,
                VSd_ChildCareProviderLastName = lineItem.ChildcareProviderLastName,
                VSd_VSu_ChildCareProviderPhoneNo = lineItem.ChildcareProviderPhoneNo,
            };

            return entity;
        }

        /// <summary>
        /// Converts DocumentDto to Dataverse Entity
        /// </summary>
        private static Entity ToDocumentEntity(this DocumentDto document)
        {
            var entity = new ActivityMimeAttachment
            {
                FileName = document.vsd_filename,
                Body = document.vsd_body,
                Subject = document.vsd_subject,
            };

            return entity;
        }

        /// <summary>
        /// Maps ApplicationDataDto to a VSd_CreateVSuCaseRequest for Dataverse
        /// </summary>
        /// <param name="applicationData">The application data from the API</param>
        /// <returns>A VSd_CreateVSuCaseRequest ready to be executed</returns>
        /// <exception cref="ArgumentNullException">Thrown when applicationData is null</exception>
        public static VSd_CreateVSuCaseRequest ToVSdCreateVSuCaseRequest(this ApplicationDataDto applicationData)
        {
            if (applicationData == null)
            {
                throw new ArgumentNullException(nameof(applicationData));
            }

            var request = new VSd_CreateVSuCaseRequest();

            // Map Application
            if (applicationData.Application != null)
            {
                request.Application = applicationData.Application.ToApplicationEntity();
            }

            // Map CourtInfo Collection
            if (applicationData.CourtInfoCollection != null && applicationData.CourtInfoCollection.Length > 0)
            {
                request.CourtInfoCollection = new EntityCollection(
                    applicationData.CourtInfoCollection.Select(c => c.ToCourtInfoEntity()).ToList()
                );
            }

            // Map Provider Collection
            if (applicationData.ProviderCollection != null && applicationData.ProviderCollection.Length > 0)
            {
                request.ProviderCollection = new EntityCollection(
                    applicationData.ProviderCollection.Select(p => p.ToParticipantEntity()).ToList()
                );
            }

            // Map Offence Collection
            if (applicationData.OffenceCollection != null && applicationData.OffenceCollection.Length > 0)
            {
                request.OffenceCollection = new EntityCollection(
                    applicationData.OffenceCollection.Select(o => o.ToOffenceEntity()).ToList()
                );
            }

            // Map Travel Info Collection
            if (applicationData.TravelInfoCollection != null && applicationData.TravelInfoCollection.Length > 0)
            {
                request.TravelInfoCollection = new EntityCollection(
                    applicationData.TravelInfoCollection.Select(t => t.ToTravelInfoEntity()).ToList()
                );
            }

            // Map Document Collection
            if (applicationData.DocumentCollection != null && applicationData.DocumentCollection.Length > 0)
            {
                request.DocumentCollection = new EntityCollection(
                    applicationData.DocumentCollection.Select(d => d.ToDocumentEntity()).ToList()
                );
            }

            return request;
        }

        /// <summary>
        /// Converts ApplicationDto to Dataverse Entity
        /// </summary>
        private static Entity ToApplicationEntity(this ApplicationDto application)
        {
            var entity = new VSd_Application
            {
                VSd_VSu_ApplicationType = (VSd_VSu_ApplicationType)application.vsd_vsu_applicationtype,
                VSd_CVAp_VictimFirstName = application.vsd_cvap_victimfirstname,
                VSd_CVAp_VictimMiddleName = application.vsd_cvap_victimmiddlename,
                VSd_CVAp_VictimLastName = application.vsd_cvap_victimlastname,
                VSd_CVAp_VictimBirthdate = application.vsd_cvap_victimbirthdate,
                VSd_CVAp_VictimGenderCode = application.vsd_cvap_victimgendercode.HasValue
                    ? (VSd_Gender?)application.vsd_cvap_victimgendercode.Value
                    : null,
                VSd_VictimGenderText = application.vsd_victimgendertext,
                VSd_VictimPronouns = application.vsd_victimpronouns.HasValue
                    ? (VSd_Pronouns?)application.vsd_victimpronouns.Value
                    : null,
                VSd_VictimPronounText = application.vsd_victimpronountext,
                VSd_VictimPrimaryRaceEthnicity = application.vsd_victimprimaryraceethnicity.HasValue
                    ? (VSd_RaceEthnicity?)application.vsd_victimprimaryraceethnicity.Value
                    : null,
                VSd_VictimPrimaryRaceEthnicityText = application.vsd_victimprimaryraceethnicitytext,
                VSd_VictimIndigenous = application.vsd_victimindigenous.HasValue
                    ? (VSd_Application_VSd_VictimIndigenous)application.vsd_victimindigenous.Value
                    : null,
                VSd_VSu_ApplicantType = (VSd_VSu_ApplicantType)application.vsd_vsu_applicanttype,
                VSd_VSuApplicantTypeOther = application.vsd_vsu_applicanttypeother,
                VSd_VSu_OffencesComments = application.vsd_vsu_offencescomments,
                VSd_VSu_Decision1ImpactToOutcome = application.vsd_vsu_decision1impacttooutcome.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_decision1impacttooutcome.Value
                    : null,
                VSd_VSu_Decision1Comments = application.vsd_vsu_decision1comments,
                VsD_VsU_Decision2TravelOver100Km = application.vsd_vsu_decision2travelover100km.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_decision2travelover100km.Value
                    : null,
                VSd_VSu_Decision2Comments = application.vsd_vsu_decision2comments,
                VSd_VSu_Decision3NoOtherFundingSource = application.vsd_vsu_decision3nootherfundingsource.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_decision3nootherfundingsource.Value
                    : null,
                VSd_VSu_Decision3Comments = application.vsd_vsu_decision3comments,
                VSd_VSu_AdditionalComments = application.vsd_vsu_additionalcomments,
                VSd_CVAp_RelationshipToVictim = application.vsd_cvap_relationshiptovictim,
                VSd_VSu_VictimTravelFundApplicationSubmitted = application
                    .vsd_vsu_victimtravelfundapplicationsubmitted
                    .HasValue
                    ? (VSd_YesNoUnknown?)application.vsd_vsu_victimtravelfundapplicationsubmitted.Value
                    : null,
                VSd_VSu_VTfAppSubmittedUnknownComments = application.vsd_vsu_vtfappsubmittedunknowncomments,
                VSd_VSu_OtherFamilyMembersApplyingToVTf = application.vsd_vsu_otherfamilymembersapplyingtovtf.HasValue
                    ? (VSd_YesNoUnknown?)application.vsd_vsu_otherfamilymembersapplyingtovtf.Value
                    : null,
                VSd_VSu_OtherFamilyMemberSvTfOtherComments = application.vsd_vsu_otherfamilymembersvtfothercomments,
                VSd_VSu_VsWcOmMenTs = application.vsd_vsu_vswcomments,
                VSd_VSu_CostsCoveredByVSp = application.vsd_vsu_costscoveredbyvsp.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_costscoveredbyvsp.Value
                    : null,
                VSd_VSu_VsPcOmMenTs = application.vsd_vsu_vspcomments,
                VSd_VSu_ManagerFirstName = application.vsd_vsu_managerfirstname,
                VSd_VSu_ManagerLastName = application.vsd_vsu_managerlastname,
                VSd_VSu_OrganizationAgencyName = application.vsd_vsu_organizationagencyname,
                VSd_VSu_ManagerPhone = application.vsd_vsu_managerphone,
                VsD_VsU_ManagerEmail = application.vsd_vsu_manageremail,
                VSd_ApplicantsFirstName = application.vsd_applicantsfirstname,
                VSd_ApplicantsMiddleName = application.vsd_applicantsmiddlename,
                VSd_ApplicantsLastName = application.vsd_applicantslastname,
                VSd_ApplicantsGenderCode = application.vsd_applicantsgendercode.HasValue
                    ? (VSd_Gender?)application.vsd_applicantsgendercode.Value
                    : null,
                VSd_GenderIdentityText = application.vsd_genderidentitytext,
                VSd_Pronouns = application.vsd_pronouns.HasValue ? (VSd_Pronouns?)application.vsd_pronouns.Value : null,
                VSd_PronounText = application.vsd_pronountext,
                VSd_ApplicantsBirthdate = application.vsd_applicantsbirthdate,
                VSd_PrimaryRaceEthnicity = application.vsd_primaryraceethnicity.HasValue
                    ? (VSd_RaceEthnicity?)application.vsd_primaryraceethnicity.Value
                    : null,
                VSd_PrimaryRaceEthnicityText = application.vsd_primaryraceethnicitytext,
                VSd_Indigenous = application.vsd_indigenous.HasValue
                    ? (VSd_Application_VSd_Indigenous?)application.vsd_indigenous.Value
                    : null,
                VSd_ApplicantsPreferredLanguage = application.vsd_applicantspreferredlanguage,
                VSd_ApplicantsInterpreterNeeded = application.vsd_applicantsinterpreterneeded.HasValue
                    ? (VSd_YesNo?)application.vsd_applicantsinterpreterneeded.Value
                    : null,
                VSd_ApplicantsPrimaryAddressLine1 = application.vsd_applicantsprimaryaddressline1,
                VSd_ApplicantsPrimaryAddressLine2 = application.vsd_applicantsprimaryaddressline2,
                VSd_ApplicantsPrimaryCity = application.vsd_applicantsprimarycity,
                VSd_ApplicantsPrimaryProvince = application.vsd_applicantsprimaryprovince,
                VSd_ApplicantsPrimaryCountry = application.vsd_applicantsprimarycountry,
                VSd_ApplicantsPrimaryPostalCode = application.vsd_applicantsprimarypostalcode,
                VSd_VSu_OkToSendMail = application.vsd_vsu_oktosendmail.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_oktosendmail.Value
                    : null,
                VSd_VSu_MethodOfContact1Type = application.vsd_vsu_methodofcontact1type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.vsd_vsu_methodofcontact1type.Value
                    : null,
                VSd_VSu_MethodOfContact1Number = application.vsd_vsu_methodofcontact1number,
                VSd_VSu_MethodOfContact1Ext = application.vsd_vsu_methodofcontact1ext,
                VSd_VSu_MethodOfContact1LeaveDetailedMessage = application
                    .vsd_vsu_methodofcontact1leavedetailedmessage
                    .HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_methodofcontact1leavedetailedmessage.Value
                    : null,
                VSd_VSu_MethodOfContact2Type = application.vsd_vsu_methodofcontact2type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.vsd_vsu_methodofcontact2type.Value
                    : null,
                VSd_VSu_MethodOfContact2Number = application.vsd_vsu_methodofcontact2number,
                VSd_VSu_MethodOfContact2LeaveDetailedMessage = application
                    .vsd_vsu_methodofcontact2leavedetailedmessage
                    .HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_methodofcontact2leavedetailedmessage.Value
                    : null,
                VSd_VSu_MethodOfContact3Type = application.vsd_vsu_methodofcontact3type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.vsd_vsu_methodofcontact3type.Value
                    : null,
                VSd_VSu_MethodOfContact3Number = application.vsd_vsu_methodofcontact3number,
                VSd_VSu_MethodOfContact3LeaveDetailedMessage = application
                    .vsd_vsu_methodofcontact3leavedetailedmessage
                    .HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_methodofcontact3leavedetailedmessage.Value
                    : null,
                VsD_VsU_NotificationTo = application.vsd_vsu_notificationto.HasValue
                    ? (VsD_VsU_NotificationTo?)application.vsd_vsu_notificationto.Value
                    : null,
                VSd_VSu_DiscusSvTfAppWithVSp = application.vsd_vsu_discussvtfappwithvsp.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_discussvtfappwithvsp.Value
                    : null,
                VSd_VSu_SignificantCourtUpdates = application.vsd_vsu_significantcourtupdates.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_significantcourtupdates.Value
                    : null,
                VSd_VSu_FinalCourtResults = application.vsd_vsu_finalcourtresults.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_finalcourtresults.Value
                    : null,
                VsD_VsU_UpdatesOnAllCriminalCourtAppearances = application
                    .vsd_vsu_updatesonallcriminalcourtappearances
                    .HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_updatesonallcriminalcourtappearances.Value
                    : null,
                VSd_VSu_CriminalCourtOrdersIssued = application.vsd_vsu_criminalcourtordersissued.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_criminalcourtordersissued.Value
                    : null,
                VSd_VSu_BcCorrectionsInformation = application.vsd_vsu_bccorrectionsinformation.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_bccorrectionsinformation.Value
                    : null,
                VSd_VSu_NotificationAdditionalComments = application.vsd_vsu_notificationadditionalcomments,
                VSd_VSu_TravelExpenseRequestTransportOther = application.vsd_vsu_travelexpenserequesttransportother,
                VSd_VSu_TravelExpenseRequestOther = application.vsd_vsu_travelexpenserequestother,
                VSd_VSu_AdditionalTravelComments = application.vsd_vsu_additionaltravelcomments,
                VSd_VSu_InfoSHaRecScPBc = application.vsd_vsu_infosharecscpbc.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_infosharecscpbc.Value
                    : null,
                VsD_VsU_InfoShareVsU = application.vsd_vsu_infosharevsu.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_infosharevsu.Value
                    : null,
                VsD_VsU_InfoShareVsW = application.vsd_vsu_infosharevsw.HasValue
                    ? (VSd_YesNo?)application.vsd_vsu_infosharevsw.Value
                    : null,
                VSd_DeclarationVerified = application.vsd_declarationverified.HasValue
                    ? (VSd_YesNo?)application.vsd_declarationverified.Value
                    : null,
                VSd_DeclarationFullName = application.vsd_declarationfullname,
                VSd_DeclarationDate = application.vsd_declarationdate,
                VSd_ApplicantsSignature = application.vsd_applicantssignature,
            };

            // Handle multi-value fields that require special handling
            if (!string.IsNullOrEmpty(application.vsd_vsu_travelexpenserequest_03))
                entity["vsd_vsu_travelexpenserequest_03"] = application.vsd_vsu_travelexpenserequest_03;

            if (!string.IsNullOrEmpty(application.vsd_vsu_purposeoftravel))
                entity["vsd_vsu_purposeoftravel"] = application.vsd_vsu_purposeoftravel;

            if (application.vsd_vsu_travelperiodfrom.HasValue)
                entity["vsd_vsu_travelperiodfrom"] = application.vsd_vsu_travelperiodfrom.Value;

            if (application.vsd_vsu_travelperiodto.HasValue)
                entity["vsd_vsu_travelperiodto"] = application.vsd_vsu_travelperiodto.Value;

            return entity;
        }

        /// <summary>
        /// Converts CourtInfoDto to Dataverse Entity
        /// </summary>
        private static Entity ToCourtInfoEntity(this CourtInfoDto courtInfo)
        {
            var entity = new VSd_ApplicationCourtInformation
            {
                VSd_CourtFileNumber = courtInfo.vsd_courtfilenumber,
                VSd_CourtLocation = courtInfo.vsd_courtlocation,
            };

            return entity;
        }

        /// <summary>
        /// Converts ParticipantDto to Dataverse Entity
        /// </summary>
        private static Entity ToParticipantEntity(this ParticipantDto participant)
        {
            var entity = new VSd_Participant();

            if (!string.IsNullOrEmpty(participant.vsd_firstname))
                entity["vsd_firstname"] = participant.vsd_firstname;

            if (!string.IsNullOrEmpty(participant.vsd_middlename))
                entity["vsd_middlename"] = participant.vsd_middlename;

            if (!string.IsNullOrEmpty(participant.vsd_lastname))
                entity["vsd_lastname"] = participant.vsd_lastname;

            if (!string.IsNullOrEmpty(participant.vsd_companyname))
                entity["vsd_companyname"] = participant.vsd_companyname;

            if (!string.IsNullOrEmpty(participant.vsd_name))
                entity["vsd_name"] = participant.vsd_name;

            if (participant.vsd_birthdate.HasValue)
                entity["vsd_birthdate"] = participant.vsd_birthdate.Value;

            if (participant.vsd_gender.HasValue)
                entity["vsd_gender"] = new OptionSetValue(participant.vsd_gender.Value);

            if (!string.IsNullOrEmpty(participant.vsd_genderidentitytext))
                entity["vsd_genderidentitytext"] = participant.vsd_genderidentitytext;

            if (participant.vsd_pronouns.HasValue)
                entity["vsd_pronouns"] = new OptionSetValue(participant.vsd_pronouns.Value);

            if (!string.IsNullOrEmpty(participant.vsd_pronountext))
                entity["vsd_pronountext"] = participant.vsd_pronountext;

            if (participant.vsd_primaryraceethnicity.HasValue)
                entity["vsd_primaryraceethnicity"] = new OptionSetValue(participant.vsd_primaryraceethnicity.Value);

            if (!string.IsNullOrEmpty(participant.vsd_primaryraceethnicitytext))
                entity["vsd_primaryraceethnicitytext"] = participant.vsd_primaryraceethnicitytext;

            if (!string.IsNullOrEmpty(participant.vsd_phonenumber))
                entity["vsd_phonenumber"] = participant.vsd_phonenumber;

            if (!string.IsNullOrEmpty(participant.vsd_mainphoneextension))
                entity["vsd_mainphoneextension"] = participant.vsd_mainphoneextension;

            if (!string.IsNullOrEmpty(participant.vsd_addressline1))
                entity["vsd_addressline1"] = participant.vsd_addressline1;

            if (!string.IsNullOrEmpty(participant.vsd_addressline2))
                entity["vsd_addressline2"] = participant.vsd_addressline2;

            if (!string.IsNullOrEmpty(participant.vsd_city))
                entity["vsd_city"] = participant.vsd_city;

            if (!string.IsNullOrEmpty(participant.vsd_province))
                entity["vsd_province"] = participant.vsd_province;

            if (!string.IsNullOrEmpty(participant.vsd_postalcode))
                entity["vsd_postalcode"] = participant.vsd_postalcode;

            if (participant.vsd_vsu_oktosendmail.HasValue)
                entity["vsd_vsu_oktosendmail"] = new OptionSetValue(participant.vsd_vsu_oktosendmail.Value);

            if (!string.IsNullOrEmpty(participant.vsd_email))
                entity["vsd_email"] = participant.vsd_email;

            if (!string.IsNullOrEmpty(participant.vsd_relationship1))
                entity["vsd_relationship1"] = participant.vsd_relationship1;

            if (!string.IsNullOrEmpty(participant.vsd_relationship1other))
                entity["vsd_relationship1other"] = participant.vsd_relationship1other;

            if (!string.IsNullOrEmpty(participant.vsd_relationship2))
                entity["vsd_relationship2"] = participant.vsd_relationship2;

            if (!string.IsNullOrEmpty(participant.vsd_relationship2other))
                entity["vsd_relationship2other"] = participant.vsd_relationship2other;

            if (participant.vsd_vsu_methodofcontact1type.HasValue)
                entity["vsd_vsu_methodofcontact1type"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact1type.Value
                );

            if (!string.IsNullOrEmpty(participant.vsd_vsu_methodofcontact1number))
                entity["vsd_vsu_methodofcontact1number"] = participant.vsd_vsu_methodofcontact1number;

            if (!string.IsNullOrEmpty(participant.vsd_vsu_methodofcontact1ext))
                entity["vsd_vsu_methodofcontact1ext"] = participant.vsd_vsu_methodofcontact1ext;

            if (participant.vsd_vsu_methodofcontact1leavedetailedmessage.HasValue)
                entity["vsd_vsu_methodofcontact1leavedetailedmessage"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact1leavedetailedmessage.Value
                );

            if (participant.vsd_vsu_methodofcontact2type.HasValue)
                entity["vsd_vsu_methodofcontact2type"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact2type.Value
                );

            if (!string.IsNullOrEmpty(participant.vsd_vsu_methodofcontact2number))
                entity["vsd_vsu_methodofcontact2number"] = participant.vsd_vsu_methodofcontact2number;

            if (participant.vsd_vsu_methodofcontact2leavedetailedmessage.HasValue)
                entity["vsd_vsu_methodofcontact2leavedetailedmessage"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact2leavedetailedmessage.Value
                );

            if (participant.vsd_vsu_methodofcontact3type.HasValue)
                entity["vsd_vsu_methodofcontact3type"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact3type.Value
                );

            if (!string.IsNullOrEmpty(participant.vsd_vsu_methodofcontact3number))
                entity["vsd_vsu_methodofcontact3number"] = participant.vsd_vsu_methodofcontact3number;

            if (participant.vsd_vsu_methodofcontact3leavedetailedmessage.HasValue)
                entity["vsd_vsu_methodofcontact3leavedetailedmessage"] = new OptionSetValue(
                    participant.vsd_vsu_methodofcontact3leavedetailedmessage.Value
                );

            return entity;
        }

        /// <summary>
        /// Converts OffenceDto to Dataverse Entity
        /// </summary>
        private static Entity ToOffenceEntity(this OffenceDto offence)
        {
            var entity = new VSd_Offense();

            if (!string.IsNullOrEmpty(offence.vsd_offenseid))
                entity["vsd_offenseid"] = offence.vsd_offenseid;

            return entity;
        }

        #endregion
    }
}
