using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class ReimbursementData
    {
        public Case CaseId { get; set; }
        public string ContactInfoComments { get; set; }
        public Invoice Invoice { get; set; }
        public TravelInfo[] TravelInfoCollection { get; set; }
        public InvoiceLineDetail[] TransportationExpenseCollection { get; set; }
        public InvoiceLineDetail[] AccommodationExpenseCollection { get; set; }
        public InvoiceLineDetail[] MealExpenseCollection { get; set; }
        public InvoiceLineDetail[] ChildcareExpenseCollection { get; set; }
        public InvoiceLineDetail[] OtherExpenseCollection { get; set; }
    }
}
