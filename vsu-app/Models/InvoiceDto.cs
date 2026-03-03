using System;

namespace Models
{
    public class InvoiceDto
    {
        public int? ClaimantContactInfoChanged { get; set; }
        public DateTime? SignatureDate { get; set; }
        public string Signature { get; set; }
        public string DeclarationSignature { get; set; }
    }
}
