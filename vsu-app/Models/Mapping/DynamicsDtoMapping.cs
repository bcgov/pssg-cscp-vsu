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

            // Map Invoice as entity parameter container
            if (reimbursement.Invoice != null)
            {
                var invoiceEntity = new Entity("vsd_invoice");

                if (reimbursement.Invoice.ClaimantContactInfoChanged.HasValue)
                    invoiceEntity["vsd_vsu_claimantcontactinfochanged"] = new OptionSetValue(
                        reimbursement.Invoice.ClaimantContactInfoChanged.Value
                    );

                if (reimbursement.Invoice.SignatureDate.HasValue)
                    invoiceEntity["vsd_vsu_signaturedate"] = reimbursement.Invoice.SignatureDate.Value;

                if (!string.IsNullOrEmpty(reimbursement.Invoice.Signature))
                    invoiceEntity["vsd_signature"] = reimbursement.Invoice.Signature;

                if (!string.IsNullOrEmpty(reimbursement.Invoice.DeclarationSignature))
                    invoiceEntity["vsd_vsu_declarationsignature"] = reimbursement.Invoice.DeclarationSignature;

                request.Invoice = invoiceEntity;
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
            var entity = new Entity();

            if (invoice.ClaimantContactInfoChanged.HasValue)
                entity["vsd_vsu_claimantcontactinfochanged"] = new OptionSetValue(
                    invoice.ClaimantContactInfoChanged.Value
                );

            if (invoice.SignatureDate.HasValue)
                entity["vsd_vsu_signaturedate"] = invoice.SignatureDate.Value;

            if (!string.IsNullOrEmpty(invoice.Signature))
                entity["vsd_signature"] = invoice.Signature;

            if (!string.IsNullOrEmpty(invoice.DeclarationSignature))
                entity["vsd_vsu_declarationsignature"] = invoice.DeclarationSignature;

            return entity;
        }

        /// <summary>
        /// Converts TravelInfoDto to Dataverse Entity
        /// </summary>
        private static Entity ToTravelInfoEntity(this TravelInfoDto travelInfo)
        {
            var entity = new Entity("vsd_travelinformation");

            if (!string.IsNullOrEmpty(travelInfo.CourtFileNumber))
                entity["vsd_courtfilenumber_text"] = travelInfo.CourtFileNumber;

            if (travelInfo.CourtDate.HasValue)
                entity["vsd_courtdate"] = travelInfo.CourtDate.Value;

            if (!string.IsNullOrEmpty(travelInfo.PurposeOfTravel))
                entity["vsd_purposeoftravel"] = travelInfo.PurposeOfTravel;

            if (travelInfo.TravelPeriodFrom.HasValue)
                entity["vsd_travelperiodfrom"] = travelInfo.TravelPeriodFrom.Value;

            if (travelInfo.TravelPeriodTo.HasValue)
                entity["vsd_travelperiodto"] = travelInfo.TravelPeriodTo.Value;

            return entity;
        }

        /// <summary>
        /// Converts InvoiceLineItemDto to Dataverse Entity
        /// </summary>
        private static Entity ToInvoiceLineItemEntity(this InvoiceLineItemDto lineItem)
        {
            var entity = new Entity("vsd_invoicelinedetail");

            if (lineItem.ExpenseType.HasValue)
                entity["vsd_vsu_expensetype"] = new OptionSetValue(lineItem.ExpenseType.Value);

            if (lineItem.TransportationType.HasValue)
                entity["vsd_vsu_transportationtype"] = new OptionSetValue(lineItem.TransportationType.Value);

            if (lineItem.Mileage.HasValue)
                entity["vsd_vsu_mileage"] = lineItem.Mileage.Value;

            if (lineItem.Amount.HasValue)
                entity["vsd_amountsimple"] = lineItem.Amount.Value;

            if (!string.IsNullOrEmpty(lineItem.Other))
                entity["vsd_vsu_other"] = lineItem.Other;

            if (lineItem.Number.HasValue)
                entity["vsd_vsu_number"] = lineItem.Number.Value;

            if (lineItem.DailyRoomRate.HasValue)
                entity["vsd_vsu_dailyroomrate"] = lineItem.DailyRoomRate.Value;

            if (lineItem.ChildAge.HasValue)
                entity["vsd_vsu_childage"] = lineItem.ChildAge.Value;

            if (lineItem.ChildcareStartDate.HasValue)
                entity["vsd_vsu_childcarestartdate"] = lineItem.ChildcareStartDate.Value;

            if (lineItem.ChildcareEndDate.HasValue)
                entity["vsd_vsu_childcareenddate"] = lineItem.ChildcareEndDate.Value;

            if (!string.IsNullOrEmpty(lineItem.ChildcareProviderFirstName))
                entity["vsd_vsu_childcareproviderfirstname"] = lineItem.ChildcareProviderFirstName;

            if (!string.IsNullOrEmpty(lineItem.ChildcareProviderLastName))
                entity["vsd_childcareproviderlastname"] = lineItem.ChildcareProviderLastName;

            if (!string.IsNullOrEmpty(lineItem.ChildcareProviderPhoneNo))
                entity["vsd_vsu_childcareproviderphoneno"] = lineItem.ChildcareProviderPhoneNo;

            return entity;
        }

        /// <summary>
        /// Converts DocumentDto to Dataverse Entity
        /// </summary>
        private static Entity ToDocumentEntity(this DocumentDto document)
        {
            var entity = new Entity("activitymimeattachment");

            if (!string.IsNullOrEmpty(document.FileName))
                entity["filename"] = document.FileName;

            if (!string.IsNullOrEmpty(document.Body))
                entity["body"] = document.Body;

            if (!string.IsNullOrEmpty(document.Subject))
                entity["subject"] = document.Subject;

            return entity;
        }

        #endregion
    }
}
