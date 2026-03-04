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
                VSd_CourtFileNumber_Text = travelInfo.CourtFileNumber,
                VSd_CourtDate = travelInfo.CourtDate,
                VSd_PurposeOfTravel = travelInfo.PurposeOfTravel,
                VSd_TravelPeriodFrom = travelInfo.TravelPeriodFrom,
                VSd_TravelPeriodTo = travelInfo.TravelPeriodTo,
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
                FileName = document.FileName,
                Body = document.Body,
                Subject = document.Subject,
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
                VSd_VSu_ApplicationType = (VSd_VSu_ApplicationType)application.VsuApplicationType,
                VSd_CVAp_VictimFirstName = application.VictimFirstName,
                VSd_CVAp_VictimMiddleName = application.VictimMiddleName,
                VSd_CVAp_VictimLastName = application.VictimLastName,
                VSd_CVAp_VictimBirthdate = application.VictimBirthDate,
                VSd_CVAp_VictimGenderCode = application.VictimGenderCode.HasValue
                    ? (VSd_Gender?)application.VictimGenderCode.Value
                    : null,
                VSd_VictimGenderText = application.VictimGenderText,
                VSd_VictimPronouns = application.VictimPronouns.HasValue
                    ? (VSd_Pronouns?)application.VictimPronouns.Value
                    : null,
                VSd_VictimPronounText = application.VictimPronounText,
                VSd_VictimPrimaryRaceEthnicity = application.VictimPrimaryRaceEthnicity.HasValue
                    ? (VSd_RaceEthnicity?)application.VictimPrimaryRaceEthnicity.Value
                    : null,
                VSd_VictimPrimaryRaceEthnicityText = application.VictimPrimaryRaceEthnicityText,
                VSd_VictimIndigenous = application.VictimIndigenous.HasValue
                    ? (VSd_Application_VSd_VictimIndigenous)application.VictimIndigenous.Value
                    : null,
                VSd_VSu_ApplicantType = (VSd_VSu_ApplicantType)application.VsuApplicantType,
                VSd_VSuApplicantTypeOther = application.VsuApplicantTypeOther,
                VSd_VSu_OffencesComments = application.VsuOffencesComments,
                VSd_VSu_Decision1ImpactToOutcome = application.VsuDecision1ImpactToOutcome.HasValue
                    ? (VSd_YesNo?)application.VsuDecision1ImpactToOutcome.Value
                    : null,
                VSd_VSu_Decision1Comments = application.VsuDecision1Comments,
                VsD_VsU_Decision2TravelOver100Km = application.VsuDecision2TravelOver100Km.HasValue
                    ? (VSd_YesNo?)application.VsuDecision2TravelOver100Km.Value
                    : null,
                VSd_VSu_Decision2Comments = application.VsuDecision2Comments,
                VSd_VSu_Decision3NoOtherFundingSource = application.VsuDecision3NoOtherFundingSource.HasValue
                    ? (VSd_YesNo?)application.VsuDecision3NoOtherFundingSource.Value
                    : null,
                VSd_VSu_Decision3Comments = application.VsuDecision3Comments,
                VSd_VSu_AdditionalComments = application.VsuAdditionalComments,
                VSd_CVAp_RelationshipToVictim = application.RelationshipToVictim,
                VSd_VSu_VictimTravelFundApplicationSubmitted = application
                    .VsuVictimTravelFundApplicationSubmitted
                    .HasValue
                    ? (VSd_YesNoUnknown?)application.VsuVictimTravelFundApplicationSubmitted.Value
                    : null,
                VSd_VSu_VTfAppSubmittedUnknownComments = application.VsuVtfAppSubmittedUnknownComments,
                VSd_VSu_OtherFamilyMembersApplyingToVTf = application.VsuOtherFamilyMembersApplyingToVtf.HasValue
                    ? (VSd_YesNoUnknown?)application.VsuOtherFamilyMembersApplyingToVtf.Value
                    : null,
                VSd_VSu_OtherFamilyMemberSvTfOtherComments = application.VsuOtherFamilyMembersVtfOtherComments,
                VSd_VSu_VsWcOmMenTs = application.VsuVswComments,
                VSd_VSu_CostsCoveredByVSp = application.VsuCostsCoveredByVsp.HasValue
                    ? (VSd_YesNo?)application.VsuCostsCoveredByVsp.Value
                    : null,
                VSd_VSu_VsPcOmMenTs = application.VsuVspComments,
                VSd_VSu_ManagerFirstName = application.VsuManagerFirstName,
                VSd_VSu_ManagerLastName = application.VsuManagerLastName,
                VSd_VSu_OrganizationAgencyName = application.VsuOrganizationAgencyName,
                VSd_VSu_ManagerPhone = application.VsuManagerPhone,
                VsD_VsU_ManagerEmail = application.VsuManagerEmail,
                VSd_ApplicantsFirstName = application.ApplicantsFirstName,
                VSd_ApplicantsMiddleName = application.ApplicantsMiddleName,
                VSd_ApplicantsLastName = application.ApplicantsLastName,
                VSd_ApplicantsGenderCode = application.ApplicantsGenderCode.HasValue
                    ? (VSd_Gender?)application.ApplicantsGenderCode.Value
                    : null,
                VSd_GenderIdentityText = application.GenderIdentityText,
                VSd_Pronouns = application.Pronouns.HasValue ? (VSd_Pronouns?)application.Pronouns.Value : null,
                VSd_PronounText = application.PronounText,
                VSd_ApplicantsBirthdate = application.ApplicantsBirthDate,
                VSd_PrimaryRaceEthnicity = application.PrimaryRaceEthnicity.HasValue
                    ? (VSd_RaceEthnicity?)application.PrimaryRaceEthnicity.Value
                    : null,
                VSd_PrimaryRaceEthnicityText = application.PrimaryRaceEthnicityText,
                VSd_Indigenous = application.Indigenous.HasValue
                    ? (VSd_Application_VSd_Indigenous?)application.Indigenous.Value
                    : null,
                VSd_ApplicantsPreferredLanguage = application.ApplicantsPreferredLanguage,
                VSd_ApplicantsInterpreterNeeded = application.ApplicantsInterpreterNeeded.HasValue
                    ? (VSd_YesNo?)application.ApplicantsInterpreterNeeded.Value
                    : null,
                VSd_ApplicantsPrimaryAddressLine1 = application.ApplicantsPrimaryAddressLine1,
                VSd_ApplicantsPrimaryAddressLine2 = application.ApplicantsPrimaryAddressLine2,
                VSd_ApplicantsPrimaryCity = application.ApplicantsPrimaryCity,
                VSd_ApplicantsPrimaryProvince = application.ApplicantsPrimaryProvince,
                VSd_ApplicantsPrimaryCountry = application.ApplicantsPrimaryCountry,
                VSd_ApplicantsPrimaryPostalCode = application.ApplicantsPrimaryPostalCode,
                VSd_VSu_OkToSendMail = application.VsuOkToSendMail.HasValue
                    ? (VSd_YesNo?)application.VsuOkToSendMail.Value
                    : null,
                VSd_VSu_MethodOfContact1Type = application.VsuMethodOfContact1Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.VsuMethodOfContact1Type.Value
                    : null,
                VSd_VSu_MethodOfContact1Number = application.VsuMethodOfContact1Number,
                VSd_VSu_MethodOfContact1Ext = application.VsuMethodOfContact1Ext,
                VSd_VSu_MethodOfContact1LeaveDetailedMessage = application
                    .VsuMethodOfContact1LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.VsuMethodOfContact1LeaveDetailedMessage.Value
                    : null,
                VSd_VSu_MethodOfContact2Type = application.VsuMethodOfContact2Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.VsuMethodOfContact2Type.Value
                    : null,
                VSd_VSu_MethodOfContact2Number = application.VsuMethodOfContact2Number,
                VSd_VSu_MethodOfContact2LeaveDetailedMessage = application
                    .VsuMethodOfContact2LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.VsuMethodOfContact2LeaveDetailedMessage.Value
                    : null,
                VSd_VSu_MethodOfContact3Type = application.VsuMethodOfContact3Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.VsuMethodOfContact3Type.Value
                    : null,
                VSd_VSu_MethodOfContact3Number = application.VsuMethodOfContact3Number,
                VSd_VSu_MethodOfContact3LeaveDetailedMessage = application
                    .VsuMethodOfContact3LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.VsuMethodOfContact3LeaveDetailedMessage.Value
                    : null,
                VsD_VsU_NotificationTo = application.VsuNotificationTo.HasValue
                    ? (VsD_VsU_NotificationTo?)application.VsuNotificationTo.Value
                    : null,
                VSd_VSu_DiscusSvTfAppWithVSp = application.VsuDiscussVtfAppWithVsp.HasValue
                    ? (VSd_YesNo?)application.VsuDiscussVtfAppWithVsp.Value
                    : null,
                VSd_VSu_SignificantCourtUpdates = application.VsuSignificantCourtUpdates.HasValue
                    ? (VSd_YesNo?)application.VsuSignificantCourtUpdates.Value
                    : null,
                VSd_VSu_FinalCourtResults = application.VsuFinalCourtResults.HasValue
                    ? (VSd_YesNo?)application.VsuFinalCourtResults.Value
                    : null,
                VsD_VsU_UpdatesOnAllCriminalCourtAppearances = application
                    .VsuUpdatesOnAllCriminalCourtAppearances
                    .HasValue
                    ? (VSd_YesNo?)application.VsuUpdatesOnAllCriminalCourtAppearances.Value
                    : null,
                VSd_VSu_CriminalCourtOrdersIssued = application.VsuCriminalCourtOrdersIssued.HasValue
                    ? (VSd_YesNo?)application.VsuCriminalCourtOrdersIssued.Value
                    : null,
                VSd_VSu_BcCorrectionsInformation = application.VsuBcCorrectionsInformation.HasValue
                    ? (VSd_YesNo?)application.VsuBcCorrectionsInformation.Value
                    : null,
                VSd_VSu_NotificationAdditionalComments = application.VsuNotificationAdditionalComments,
                VSd_VSu_TravelExpenseRequestTransportOther = application.VsuTravelExpenseRequestTransportOther,
                VSd_VSu_TravelExpenseRequestOther = application.VsuTravelExpenseRequestOther,
                VSd_VSu_AdditionalTravelComments = application.VsuAdditionalTravelComments,
                VSd_VSu_InfoSHaRecScPBc = application.VsuInfoShareCscpBc.HasValue
                    ? (VSd_YesNo?)application.VsuInfoShareCscpBc.Value
                    : null,
                VsD_VsU_InfoShareVsU = application.VsuInfoShareVsu.HasValue
                    ? (VSd_YesNo?)application.VsuInfoShareVsu.Value
                    : null,
                VsD_VsU_InfoShareVsW = application.VsuInfoShareVsw.HasValue
                    ? (VSd_YesNo?)application.VsuInfoShareVsw.Value
                    : null,
                VSd_DeclarationVerified = application.DeclarationVerified.HasValue
                    ? (VSd_YesNo?)application.DeclarationVerified.Value
                    : null,
                VSd_DeclarationFullName = application.DeclarationFullName,
                VSd_DeclarationDate = application.DeclarationDate,
                VSd_ApplicantsSignature = application.ApplicantsSignature,
            };

            // Handle multi-value fields that require special handling
            if (!string.IsNullOrEmpty(application.VsuTravelExpenseRequest))
                entity["vsd_vsu_travelexpenserequest_03"] = application.VsuTravelExpenseRequest;

            if (!string.IsNullOrEmpty(application.VsuPurposeOfTravel))
                entity["vsd_vsu_purposeoftravel"] = application.VsuPurposeOfTravel;

            if (application.VsuTravelPeriodFrom.HasValue)
                entity["vsd_vsu_travelperiodfrom"] = application.VsuTravelPeriodFrom.Value;

            if (application.VsuTravelPeriodTo.HasValue)
                entity["vsd_vsu_travelperiodto"] = application.VsuTravelPeriodTo.Value;

            return entity;
        }

        /// <summary>
        /// Converts CourtInfoDto to Dataverse Entity
        /// </summary>
        private static Entity ToCourtInfoEntity(this CourtInfoDto courtInfo)
        {
            var entity = new VSd_ApplicationCourtInformation
            {
                VSd_CourtFileNumber = courtInfo.CourtFileNumber,
                VSd_CourtLocation = courtInfo.CourtLocation,
            };

            return entity;
        }

        /// <summary>
        /// Converts ParticipantDto to Dataverse Entity
        /// </summary>
        private static Entity ToParticipantEntity(this ParticipantDto participant)
        {
            var entity = new VSd_Participant();

            if (!string.IsNullOrEmpty(participant.FirstName))
                entity["vsd_firstname"] = participant.FirstName;

            if (!string.IsNullOrEmpty(participant.MiddleName))
                entity["vsd_middlename"] = participant.MiddleName;

            if (!string.IsNullOrEmpty(participant.LastName))
                entity["vsd_lastname"] = participant.LastName;

            if (!string.IsNullOrEmpty(participant.CompanyName))
                entity["vsd_companyname"] = participant.CompanyName;

            if (!string.IsNullOrEmpty(participant.Name))
                entity["vsd_name"] = participant.Name;

            if (participant.BirthDate.HasValue)
                entity["vsd_birthdate"] = participant.BirthDate.Value;

            if (participant.Gender.HasValue)
                entity["vsd_gender"] = new OptionSetValue(participant.Gender.Value);

            if (!string.IsNullOrEmpty(participant.GenderIdentityText))
                entity["vsd_genderidentitytext"] = participant.GenderIdentityText;

            if (participant.Pronouns.HasValue)
                entity["vsd_pronouns"] = new OptionSetValue(participant.Pronouns.Value);

            if (!string.IsNullOrEmpty(participant.PronounText))
                entity["vsd_pronountext"] = participant.PronounText;

            if (participant.PrimaryRaceEthnicity.HasValue)
                entity["vsd_primaryraceethnicity"] = new OptionSetValue(participant.PrimaryRaceEthnicity.Value);

            if (!string.IsNullOrEmpty(participant.PrimaryRaceEthnicityText))
                entity["vsd_primaryraceethnicitytext"] = participant.PrimaryRaceEthnicityText;

            if (!string.IsNullOrEmpty(participant.PhoneNumber))
                entity["vsd_phonenumber"] = participant.PhoneNumber;

            if (!string.IsNullOrEmpty(participant.MainPhoneExtension))
                entity["vsd_mainphoneextension"] = participant.MainPhoneExtension;

            if (!string.IsNullOrEmpty(participant.AddressLine1))
                entity["vsd_addressline1"] = participant.AddressLine1;

            if (!string.IsNullOrEmpty(participant.AddressLine2))
                entity["vsd_addressline2"] = participant.AddressLine2;

            if (!string.IsNullOrEmpty(participant.City))
                entity["vsd_city"] = participant.City;

            if (!string.IsNullOrEmpty(participant.Province))
                entity["vsd_province"] = participant.Province;

            if (!string.IsNullOrEmpty(participant.PostalCode))
                entity["vsd_postalcode"] = participant.PostalCode;

            if (participant.VsuOkToSendMail.HasValue)
                entity["vsd_vsu_oktosendmail"] = new OptionSetValue(participant.VsuOkToSendMail.Value);

            if (!string.IsNullOrEmpty(participant.Email))
                entity["vsd_email"] = participant.Email;

            if (!string.IsNullOrEmpty(participant.Relationship1))
                entity["vsd_relationship1"] = participant.Relationship1;

            if (!string.IsNullOrEmpty(participant.Relationship1Other))
                entity["vsd_relationship1other"] = participant.Relationship1Other;

            if (!string.IsNullOrEmpty(participant.Relationship2))
                entity["vsd_relationship2"] = participant.Relationship2;

            if (!string.IsNullOrEmpty(participant.Relationship2Other))
                entity["vsd_relationship2other"] = participant.Relationship2Other;

            if (participant.VsuMethodOfContact1Type.HasValue)
                entity["vsd_vsu_methodofcontact1type"] = new OptionSetValue(participant.VsuMethodOfContact1Type.Value);

            if (!string.IsNullOrEmpty(participant.VsuMethodOfContact1Number))
                entity["vsd_vsu_methodofcontact1number"] = participant.VsuMethodOfContact1Number;

            if (!string.IsNullOrEmpty(participant.VsuMethodOfContact1Ext))
                entity["vsd_vsu_methodofcontact1ext"] = participant.VsuMethodOfContact1Ext;

            if (participant.VsuMethodOfContact1LeaveDetailedMessage.HasValue)
                entity["vsd_vsu_methodofcontact1leavedetailedmessage"] = new OptionSetValue(
                    participant.VsuMethodOfContact1LeaveDetailedMessage.Value
                );

            if (participant.VsuMethodOfContact2Type.HasValue)
                entity["vsd_vsu_methodofcontact2type"] = new OptionSetValue(participant.VsuMethodOfContact2Type.Value);

            if (!string.IsNullOrEmpty(participant.VsuMethodOfContact2Number))
                entity["vsd_vsu_methodofcontact2number"] = participant.VsuMethodOfContact2Number;

            if (participant.VsuMethodOfContact2LeaveDetailedMessage.HasValue)
                entity["vsd_vsu_methodofcontact2leavedetailedmessage"] = new OptionSetValue(
                    participant.VsuMethodOfContact2LeaveDetailedMessage.Value
                );

            if (participant.VsuMethodOfContact3Type.HasValue)
                entity["vsd_vsu_methodofcontact3type"] = new OptionSetValue(participant.VsuMethodOfContact3Type.Value);

            if (!string.IsNullOrEmpty(participant.VsuMethodOfContact3Number))
                entity["vsd_vsu_methodofcontact3number"] = participant.VsuMethodOfContact3Number;

            if (participant.VsuMethodOfContact3LeaveDetailedMessage.HasValue)
                entity["vsd_vsu_methodofcontact3leavedetailedmessage"] = new OptionSetValue(
                    participant.VsuMethodOfContact3LeaveDetailedMessage.Value
                );

            return entity;
        }

        /// <summary>
        /// Converts OffenceDto to Dataverse Entity
        /// </summary>
        private static Entity ToOffenceEntity(this OffenceDto offence)
        {
            var entity = new VSd_Offense();

            if (!string.IsNullOrEmpty(offence.OffenseId))
                entity["vsd_offenseid"] = offence.OffenseId;

            return entity;
        }

        #endregion
    }
}
