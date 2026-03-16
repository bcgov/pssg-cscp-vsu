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
        public static VSd_CreateVSuCaseRequest ToVSdCreateVSuCaseRequest(this ApplicationDataDto applicationData)
        {
            if (applicationData == null)
                throw new ArgumentNullException(nameof(applicationData));
            return BuildCreateVSuCaseRequest(
                applicationData.Application,
                applicationData.CourtInfoCollection,
                applicationData.ProviderCollection,
                applicationData.OffenceCollection,
                applicationData.TravelInfoCollection,
                applicationData.DocumentCollection
            );
        }

        /// <summary>
        /// Maps NotificationApplicationDataDto to a VSd_CreateVSuCaseRequest for Dataverse
        /// </summary>
        public static VSd_CreateVSuCaseRequest ToVSdCreateVSuCaseRequest(
            this NotificationApplicationDataDto applicationData
        )
        {
            if (applicationData == null)
                throw new ArgumentNullException(nameof(applicationData));
            return BuildCreateVSuCaseRequest(
                applicationData.Application,
                applicationData.CourtInfoCollection,
                applicationData.ProviderCollection,
                applicationData.OffenceCollection,
                applicationData.TravelInfoCollection,
                applicationData.DocumentCollection
            );
        }

        /// <summary>
        /// Maps VtfApplicationDataDto to a VSd_CreateVSuCaseRequest for Dataverse
        /// </summary>
        public static VSd_CreateVSuCaseRequest ToVSdCreateVSuCaseRequest(this VtfApplicationDataDto applicationData)
        {
            if (applicationData == null)
                throw new ArgumentNullException(nameof(applicationData));
            return BuildCreateVSuCaseRequest(
                applicationData.Application,
                applicationData.CourtInfoCollection,
                applicationData.ProviderCollection,
                applicationData.OffenceCollection,
                applicationData.TravelInfoCollection,
                applicationData.DocumentCollection
            );
        }

        /// <summary>
        /// Maps VtfReimbursementApplicationDataDto to a VSd_CreateVSuCaseRequest for Dataverse
        /// </summary>
        public static VSd_CreateVSuCaseRequest ToVSdCreateVSuCaseRequest(
            this VtfReimbursementApplicationDataDto applicationData
        )
        {
            if (applicationData == null)
                throw new ArgumentNullException(nameof(applicationData));
            return BuildCreateVSuCaseRequest(
                applicationData.Application,
                applicationData.CourtInfoCollection,
                applicationData.ProviderCollection,
                applicationData.OffenceCollection,
                applicationData.TravelInfoCollection,
                applicationData.DocumentCollection
            );
        }

        /// <summary>
        /// Shared helper that builds the VSd_CreateVSuCaseRequest from the constituent parts.
        /// </summary>
        private static VSd_CreateVSuCaseRequest BuildCreateVSuCaseRequest(
            ApplicationDto application,
            CourtInfoDto[] courtInfoCollection,
            ParticipantDto[] providerCollection,
            OffenceDto[] offenceCollection,
            TravelInfoDto[] travelInfoCollection,
            DocumentDto[] documentCollection
        )
        {
            var request = new VSd_CreateVSuCaseRequest();

            // Map Application
            if (application != null)
            {
                request.Application = application.ToApplicationEntity();
            }

            // Map CourtInfo Collection
            if (courtInfoCollection != null && courtInfoCollection.Length > 0)
            {
                request.CourtInfoCollection = new EntityCollection(
                    courtInfoCollection.Select(c => c.ToCourtInfoEntity()).ToList()
                );
            }

            // Map Provider Collection
            if (providerCollection != null && providerCollection.Length > 0)
            {
                request.ProviderCollection = new EntityCollection(
                    providerCollection.Select(p => p.ToParticipantEntity()).ToList()
                );
            }

            // Map Offence Collection
            if (offenceCollection != null && offenceCollection.Length > 0)
            {
                request.OffenceCollection = new EntityCollection(
                    offenceCollection.Select(o => o.ToOffenceEntity()).ToList()
                );
            }

            // Map Travel Info Collection
            if (travelInfoCollection != null && travelInfoCollection.Length > 0)
            {
                request.TravelInfoCollection = new EntityCollection(
                    travelInfoCollection.Select(t => t.ToTravelInfoEntity()).ToList()
                );
            }

            // Map Document Collection
            if (documentCollection != null && documentCollection.Length > 0)
            {
                request.DocumentCollection = new EntityCollection(
                    documentCollection.Select(d => d.ToDocumentEntity()).ToList()
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
                VSd_VSu_ApplicationType = (VSd_VSu_ApplicationType)application.ApplicationType,
                VSd_CVAp_VictimFirstName = application.VictimFirstName,
                VSd_CVAp_VictimMiddleName = application.VictimMiddleName,
                VSd_CVAp_VictimLastName = application.VictimLastName,
                VSd_CVAp_VictimBirthdate = application.VictimBirthDate,
                VSd_OtherFirstName = application.OtherFirstname,
                VSd_OtherLastName = application.OtherLastname,
                VSd_DateOfNameChange = application.DateOfNameChange,
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
                VSd_VSu_ApplicantType = (VSd_VSu_ApplicantType)application.ApplicantType,
                VSd_VSuApplicantTypeOther = application.ApplicantTypeOther,
                VSd_VSu_OffencesComments = application.OffencesComments,
                VSd_VSu_Decision1ImpactToOutcome = application.Decision1ImpactToOutcome.HasValue
                    ? (VSd_YesNo?)application.Decision1ImpactToOutcome.Value
                    : null,
                VSd_VSu_Decision1Comments = application.Decision1Comments,
                VsD_VsU_Decision2TravelOver100Km = application.Decision2TravelOver100KM.HasValue
                    ? (VSd_YesNo?)application.Decision2TravelOver100KM.Value
                    : null,
                VSd_VSu_Decision2Comments = application.Decision2Comments,
                VSd_VSu_Decision3NoOtherFundingSource = application.Decision3NoOtherFundingSource.HasValue
                    ? (VSd_YesNo?)application.Decision3NoOtherFundingSource.Value
                    : null,
                VSd_VSu_Decision3Comments = application.Decision3Comments,
                VSd_VSu_AdditionalComments = application.AdditionalComments,
                VSd_CVAp_RelationshipToVictim = application.RelationshipToVictim,
                VSd_VSu_VictimTravelFundApplicationSubmitted = application.VictimTravelFundApplicationSubmitted.HasValue
                    ? (VSd_YesNoUnknown?)application.VictimTravelFundApplicationSubmitted.Value
                    : null,
                VSd_VSu_VTfAppSubmittedUnknownComments =
                    application.VictimTravelFundApplicationSubmittedUnknownComments,
                VSd_VSu_OtherFamilyMembersApplyingToVTf = application.OtherFamilyMembersApplyingToVTF.HasValue
                    ? (VSd_YesNoUnknown?)application.OtherFamilyMembersApplyingToVTF.Value
                    : null,
                VSd_VSu_OtherFamilyMemberSvTfOtherComments = application.OtherFamilyMembersVTFOtherComments,
                VSd_VSu_VsWcOmMenTs = application.VSWComments,
                VSd_VSu_CostsCoveredByVSp = application.CostsCoveredByVSP.HasValue
                    ? (VSd_YesNo?)application.CostsCoveredByVSP.Value
                    : null,
                VSd_VSu_VsPcOmMenTs = application.VSPComments,
                VSd_VSu_ManagerFirstName = application.ManagerFirstName,
                VSd_VSu_ManagerLastName = application.ManagerLastName,
                VSd_VSu_OrganizationAgencyName = application.OrganizationAgencyName,
                VSd_VSu_ManagerPhone = application.ManagerPhone,
                VsD_VsU_ManagerEmail = application.ManagerEmail,
                VSd_ApplicantsFirstName = application.ApplicantsFirstName,
                VSd_ApplicantsMiddleName = application.ApplicantsMiddleName,
                VSd_ApplicantsLastName = application.ApplicantsLastName,
                VSd_ApplicantsMaritalStatus = application.ApplicantsMaritalStatus.HasValue
                    ? (VSd_MaritalStatus?)application.ApplicantsMaritalStatus.Value
                    : null,
                VSd_ApplicantsGenderCode = application.ApplicantsGenderCode.HasValue
                    ? (VSd_Gender?)application.ApplicantsGenderCode.Value
                    : null,
                VSd_GenderIdentityText = application.ApplicantsGenderIdentityText,
                VSd_Pronouns = application.ApplicantsPronouns.HasValue
                    ? (VSd_Pronouns?)application.ApplicantsPronouns.Value
                    : null,
                VSd_PronounText = application.ApplicantsPronounText,
                VSd_ApplicantsBirthdate = application.ApplicantsBirthDate,
                VSd_PrimaryRaceEthnicity = application.ApplicantsPrimaryRaceEthnicity.HasValue
                    ? (VSd_RaceEthnicity?)application.ApplicantsPrimaryRaceEthnicity.Value
                    : null,
                VSd_PrimaryRaceEthnicityText = application.ApplicantsPrimaryRaceEthnicityText,
                VSd_Indigenous = application.ApplicantsIndigenous.HasValue
                    ? (VSd_Application_VSd_Indigenous?)application.ApplicantsIndigenous.Value
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
                VSd_VSu_OkToSendMail = application.ApplicantsOkToSendMail.HasValue
                    ? (VSd_YesNo?)application.ApplicantsOkToSendMail.Value
                    : null,
                VSd_VSu_MethodOfContact1Type = application.ApplicantsMethodOfContact1Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.ApplicantsMethodOfContact1Type.Value
                    : null,
                VSd_VSu_MethodOfContact1Number = application.ApplicantsMethodOfContact1Number,
                VSd_VSu_MethodOfContact1Ext = application.ApplicantsMethodOfContact1Ext,
                VSd_VSu_MethodOfContact1LeaveDetailedMessage = application
                    .ApplicantsMethodOfContact1LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.ApplicantsMethodOfContact1LeaveDetailedMessage.Value
                    : null,
                VSd_VSu_MethodOfContact2Type = application.ApplicantsMethodOfContact2Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.ApplicantsMethodOfContact2Type.Value
                    : null,
                VSd_VSu_MethodOfContact2Number = application.ApplicantsMethodOfContact2Number,
                VSd_VSu_MethodOfContact2LeaveDetailedMessage = application
                    .ApplicantsMethodOfContact2LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.ApplicantsMethodOfContact2LeaveDetailedMessage.Value
                    : null,
                VSd_VSu_MethodOfContact3Type = application.ApplicantsMethodOfContact3Type.HasValue
                    ? (VSd_VSu_VSuMethodsOfContact?)application.ApplicantsMethodOfContact3Type.Value
                    : null,
                VSd_VSu_MethodOfContact3Number = application.ApplicantsMethodOfContact3Number,
                VSd_VSu_MethodOfContact3LeaveDetailedMessage = application
                    .ApplicantsMethodOfContact3LeaveDetailedMessage
                    .HasValue
                    ? (VSd_YesNo?)application.ApplicantsMethodOfContact3LeaveDetailedMessage.Value
                    : null,
                VsD_VsU_NotificationTo = application.ApplicantsNotificationTo.HasValue
                    ? (VsD_VsU_NotificationTo?)application.ApplicantsNotificationTo.Value
                    : null,
                VSd_VSu_DiscusSvTfAppWithVSp = application.ApplicantsDiscussVTFAppWithVSP.HasValue
                    ? (VSd_YesNo?)application.ApplicantsDiscussVTFAppWithVSP.Value
                    : null,
                VSd_VSu_SignificantCourtUpdates = application.ApplicantsSignificantCourtUpdates.HasValue
                    ? (VSd_YesNo?)application.ApplicantsSignificantCourtUpdates.Value
                    : null,
                VSd_VSu_FinalCourtResults = application.ApplicantsFinalCourtResults.HasValue
                    ? (VSd_YesNo?)application.ApplicantsFinalCourtResults.Value
                    : null,
                VsD_VsU_UpdatesOnAllCriminalCourtAppearances = application
                    .ApplicantsUpdatesOnAllCriminalCourtAppearances
                    .HasValue
                    ? (VSd_YesNo?)application.ApplicantsUpdatesOnAllCriminalCourtAppearances.Value
                    : null,
                VSd_VSu_CriminalCourtOrdersIssued = application.ApplicantsCriminalCourtOrdersIssued.HasValue
                    ? (VSd_YesNo?)application.ApplicantsCriminalCourtOrdersIssued.Value
                    : null,
                VSd_VSu_BcCorrectionsInformation = application.ApplicantsBCCorrectionsInformation.HasValue
                    ? (VSd_YesNo?)application.ApplicantsBCCorrectionsInformation.Value
                    : null,
                VSd_VSu_NotificationAdditionalComments = application.ApplicantsNotificationAdditionalComments,
                VSd_VSu_TravelExpenseRequestTransportOther = application.ApplicantsTravelExpenseRequestTransportOther,
                VSd_VSu_TravelExpenseRequestOther = application.ApplicantsTravelExpenseRequestOther,
                VSd_VSu_AdditionalTravelComments = application.ApplicantsAdditionalTravelComments,
                VSd_VSu_InfoSHaRecScPBc = application.ApplicantsInfoShareCSCPBC.HasValue
                    ? (VSd_YesNo?)application.ApplicantsInfoShareCSCPBC.Value
                    : null,
                VsD_VsU_InfoShareVsU = application.ApplicantsInfoShareVSU.HasValue
                    ? (VSd_YesNo?)application.ApplicantsInfoShareVSU.Value
                    : null,
                VsD_VsU_InfoShareVsW = application.ApplicantsInfoShareVSW.HasValue
                    ? (VSd_YesNo?)application.ApplicantsInfoShareVSW.Value
                    : null,
                VSd_DeclarationVerified = application.ApplicantsDeclarationVerified.HasValue
                    ? (VSd_YesNo?)application.ApplicantsDeclarationVerified.Value
                    : null,
                VSd_DeclarationFullName = application.ApplicantsDeclarationFullName,
                VSd_DeclarationDate = application.ApplicantsDeclarationDate,
                VSd_ApplicantsSignature = application.ApplicantsSignature,
            };

            // Handle multi-value fields that require special handling
            if (!string.IsNullOrEmpty(application.ApplicantsTravelExpenseRequest03))
            {
                var values = application
                    .ApplicantsTravelExpenseRequest03.Split(',')
                    .Select(v => new OptionSetValue(int.Parse(v.Trim())))
                    .ToList();
                entity["vsd_vsu_travelexpenserequest_03"] = new OptionSetValueCollection(values);
            }

            if (!string.IsNullOrEmpty(application.ApplicantsPurposeOfTravel))
                entity["vsd_vsu_purposeoftravel"] = application.ApplicantsPurposeOfTravel;

            if (application.ApplicantsTravelPeriodFrom.HasValue)
                entity["vsd_vsu_travelperiodfrom"] = application.ApplicantsTravelPeriodFrom.Value;
            if (application.ApplicantsTravelPeriodTo.HasValue)
                entity["vsd_vsu_travelperiodto"] = application.ApplicantsTravelPeriodTo.Value;

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
