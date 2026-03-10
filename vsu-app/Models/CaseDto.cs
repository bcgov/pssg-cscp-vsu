using System;

namespace Models
{
    public class CaseDto
    {
        public string IncidentId { get; set; }
        public DateTime? CourtDate { get; set; }
        public string PurposeOfTravel { get; set; }
        public DateTime? TravelPeriodFrom { get; set; }
        public DateTime? TravelPeriodTo { get; set; }
    }
}
