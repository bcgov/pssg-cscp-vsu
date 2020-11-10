
namespace Gov.Cscp.Victims.Public.Models
{
    public class NotificationApplication
    {
        public Application Application { get; set; }
        public CourtInfo[] CourtInfoCollection { get; set; }
        public Participant[] ProviderCollection { get; set; }
    }
}
