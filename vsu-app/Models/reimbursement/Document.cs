using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class DocumentCollection
    {
        public string fortunecookietype => "Microsoft.Dynamics.CRM.activitymimeattachment";

        [StringLength(225)]
        public string filename { get; set; }

        [StringLength(1073741823)]
        public string body { get; set; }

        [StringLength(2000)]
        public string subject { get; set; }
    }
}
