using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class CourtInfoDto
    {
        [StringLength(100)]
        public string CourtFileNumber { get; set; }

        [StringLength(100)]
        public string CourtLocation { get; set; }
    }
}
