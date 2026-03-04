using System;
using System.ComponentModel.DataAnnotations;

namespace Gov.Cscp.Victims.Public.Models
{
    public class ParticipantDto
    {
        [StringLength(160)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string MiddleName { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string CompanyName { get; set; }

        [StringLength(400)]
        public string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? Gender { get; set; }

        [StringLength(500)]
        public string GenderIdentityText { get; set; }
        public int? Pronouns { get; set; }

        [StringLength(500)]
        public string PronounText { get; set; }

        public int? PrimaryRaceEthnicity { get; set; }

        [StringLength(500)]
        public string PrimaryRaceEthnicityText { get; set; }

        [StringLength(250)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string MainPhoneExtension { get; set; }

        [StringLength(250)]
        public string AddressLine1 { get; set; }

        [StringLength(250)]
        public string AddressLine2 { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Province { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }
        public int? VsuOkToSendMail { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(150)]
        public string Relationship1 { get; set; }

        [StringLength(100)]
        public string Relationship1Other { get; set; }

        [StringLength(150)]
        public string Relationship2 { get; set; }

        [StringLength(100)]
        public string Relationship2Other { get; set; }
        public int? VsuMethodOfContact1Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact1Number { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact1Ext { get; set; }
        public int? VsuMethodOfContact1LeaveDetailedMessage { get; set; }
        public int? VsuMethodOfContact2Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact2Number { get; set; }
        public int? VsuMethodOfContact2LeaveDetailedMessage { get; set; }
        public int? VsuMethodOfContact3Type { get; set; }

        [StringLength(100)]
        public string VsuMethodOfContact3Number { get; set; }
        public int? VsuMethodOfContact3LeaveDetailedMessage { get; set; }
    }
}
