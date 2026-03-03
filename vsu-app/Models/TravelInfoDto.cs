using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class TravelInfoDto
    {
        [StringLength(100)]
        public string CourtFileNumber { get; set; }
        public DateTime? CourtDate { get; set; }

        [StringLength(1000)]
        public string PurposeOfTravel { get; set; }
        public DateTime? TravelPeriodFrom { get; set; }
        public DateTime? TravelPeriodTo { get; set; }
    }
}
