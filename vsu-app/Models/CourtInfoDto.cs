using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class CourtInfoDto
    {
        [StringLength(100)]
        public string vsd_courtfilenumber { get; set; }

        [StringLength(100)]
        public string vsd_courtlocation { get; set; }
    }
}
