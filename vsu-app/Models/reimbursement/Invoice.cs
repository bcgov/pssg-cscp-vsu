using System;

namespace Gov.Cscp.Victims.Public.Models
{
    public class Invoice
    {
        public int? vsd_vsu_claimantcontactinfochanged { get; set; }
        public DateTime? vsd_vsu_signaturedate { get; set; }
        public string vsd_signature { get; set; }
        public string vsd_vsu_declarationsignature { get; set; }
    }
}
