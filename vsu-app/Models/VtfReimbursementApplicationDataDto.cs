using Models;

namespace Gov.Cscp.Victims.Public.Models
{
    public class VtfReimbursementApplicationDataDto
    {
        public VtfReimbursementApplicationDto Application { get; set; }
        public CourtInfoDto[] CourtInfoCollection { get; set; }
        public ParticipantDto[] ProviderCollection { get; set; }
        public OffenceDto[] OffenceCollection { get; set; }
        public TravelInfoDto[] TravelInfoCollection { get; set; }
        public DocumentDto[] DocumentCollection { get; set; }
    }
}
