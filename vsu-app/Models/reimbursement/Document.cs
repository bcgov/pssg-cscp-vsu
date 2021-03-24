
namespace Gov.Cscp.Victims.Public.Models
{
    public class DocumentCollection
    {
        public string fortunecookietype => "Microsoft.Dynamics.CRM.activitymimeattachment";
        public string filename { get; set; }
        public string body { get; set; }
        public string subject { get; set; }
    }
}