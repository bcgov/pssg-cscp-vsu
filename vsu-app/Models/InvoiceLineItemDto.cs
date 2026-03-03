using System;
using System.ComponentModel.DataAnnotations;

namespace Model;

public class InvoiceLineItemDto
{
    public int? ExpenseType { get; set; }

    public int? TransportationType { get; set; }
    public int? Mileage { get; set; }
    public double? Amount { get; set; }

    public string Other { get; set; }
    public int? Number { get; set; }
    public int? DailyRoomRate { get; set; }
    public int? ChildAge { get; set; }
    public DateTime? ChildcareStartDate { get; set; }
    public DateTime? ChildcareEndDate { get; set; }

    [StringLength(160)]
    public string ChildcareProviderFirstName { get; set; }

    [StringLength(160)]
    public string ChildcareProviderLastName { get; set; }

    [StringLength(20)]
    public string ChildcareProviderPhoneNo { get; set; }
}
