using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class InvoiceLineDetail
    {
        public string fortunecookietype { get { return "#Microsoft.Dynamics.CRM.vsd_invoicelinedetail"; } }
        public int vsd_vsu_expensetype { get; set; }

        public int? vsd_vsu_transportationtype { get; set; }
        public int? vsd_vsu_mileage { get; set; }
        public int? vsd_amountsimple { get; set; }

        public string vsd_vsu_other { get; set; }
        public int? vsd_vsu_number { get; set; }
        
        public int? vsd_vsu_childage { get; set; }
        public DateTime? vsd_vsu_childcarestartdate { get; set; }
        public DateTime? vsd_vsu_childcareenddate { get; set; }
        public string vsd_vsu_childcareproviderfirstname { get; set; }
        public string vsd_childcareproviderlastname { get; set; }
        public string vsd_vsu_childcareproviderphoneno { get; set; }
    }
}
