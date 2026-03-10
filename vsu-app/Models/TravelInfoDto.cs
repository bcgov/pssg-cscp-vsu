using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class TravelInfoDto
    {
        public DateTime? vsd_courtdate { get; set; }

        [StringLength(100)]
        public string vsd_courtfilenumber_text { get; set; }

        [StringLength(1000)]
        public string vsd_purposeoftravel { get; set; }
        public DateTime? vsd_travelperiodfrom { get; set; }
        public DateTime? vsd_travelperiodto { get; set; }
    }
}
