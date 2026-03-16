using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class DocumentDto
    {
        [StringLength(225)]
        public string Filename { get; set; }

        [StringLength(1073741823)]
        public string Body { get; set; }

        [StringLength(2000)]
        public string Subject { get; set; }
    }
}
