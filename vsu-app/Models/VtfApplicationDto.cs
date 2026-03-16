using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    /// <summary>
    /// Application DTO for Victim Travel Fund Applications.
    /// Decision1-3 fields are required for this application type.
    /// </summary>
    public class VtfApplicationDto : ApplicationDto
    {
        [Required]
        public override int? Decision1ImpactToOutcome { get; set; }

        [Required]
        public override int? Decision2TravelOver100KM { get; set; }

        [Required]
        public override int? Decision3NoOtherFundingSource { get; set; }
    }
}
