using Gov.Cscp.Victims.Public.Models;
using Model;

namespace Models
{
    public class ReimbursementCaseDto
    {
        public CaseDto CaseId { get; set; }
        public string ContactInfoComments { get; set; }
        public InvoiceDto Invoice { get; set; }
        public TravelInfoDto[] TravelInfoCollection { get; set; }
        public InvoiceLineItemDto[] TransportationExpenseCollection { get; set; }
        public InvoiceLineItemDto[] AccommodationExpenseCollection { get; set; }
        public InvoiceLineItemDto[] MealExpenseCollection { get; set; }
        public InvoiceLineItemDto[] ChildcareExpenseCollection { get; set; }
        public InvoiceLineItemDto[] OtherExpenseCollection { get; set; }
        public DocumentDto[] DocumentCollection { get; set; }
    }
}
