using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class DocumentDto
    {
        [StringLength(225)]
        public string vsd_filename { get; set; }

        [StringLength(1073741823)]
        public string vsd_body { get; set; }

        [StringLength(2000)]
        public string vsd_subject { get; set; }
    }
}
