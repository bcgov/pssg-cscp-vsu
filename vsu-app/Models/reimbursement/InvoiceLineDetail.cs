using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class InvoiceLineDetail
    {
        public string fortunecookietype
        {
            get { return "#Microsoft.Dynamics.CRM.vsd_invoicelinedetail"; }
        }
        public int vsd_vsu_expensetype { get; set; }

        public int? vsd_vsu_transportationtype { get; set; }
        public int? vsd_vsu_mileage { get; set; }
        public int? vsd_amountsimple { get; set; }

        public string vsd_vsu_other { get; set; }
        public int? vsd_vsu_number { get; set; }
        public int? vsd_vsu_dailyroomrate { get; set; }

        public int? vsd_vsu_childage { get; set; }
        public DateTime? vsd_vsu_childcarestartdate { get; set; }
        public DateTime? vsd_vsu_childcareenddate { get; set; }

        [StringLength(160)]
        public string vsd_vsu_childcareproviderfirstname { get; set; }

        [StringLength(160)]
        public string vsd_childcareproviderlastname { get; set; }

        [StringLength(20)]
        public string vsd_vsu_childcareproviderphoneno { get; set; }
    }
}
