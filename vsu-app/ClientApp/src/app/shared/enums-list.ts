export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

export class EnumHelper {
    public ApplicantType = {
        Victim:                 { val: 100000000, name: "Victim" },
        Civil_Protected_Party:  { val: 100000001, name: "Civil Protected Party" },
        Victim_Parent:          { val: 100000002, name: "Victim's Parent / Guardian" },
        Other_Family_Member:    { val: 100000003, name: "Other Family Member" },
    };

    public NotificationRecipientEnum = {
        Myself:                                 { val: 100000000, name: "Victim" },
        Designate:                              { val: 100000001, name: "Civil Protected Party" },
        Victim_Service_Worker:                  { val: 100000002, name: "Victim's Parent / Guardian" },
        Myself_And_Designate:                   { val: 100000003, name: "Other Family Member" },
        Myself_And_Victim_Service_Worker:       { val: 100000004, name: "Other Family Member" },
        Designate_And_Victim_Service_Worker:    { val: 100000005, name: "Other Family Member" },
    };

    public Gender = {
        Male:   { val: 100000000, name: "M" },
        Female: { val: 100000001, name: "F" },
        X:      { val: 100000002, name: "X" },
      };

    public Boolean = {
        True:   { val: 100000001, name: "True"},
        False:  { val: 100000000, name: "False"},
    }

    public ContactType = {
        Telephone:  { val: 100000000, name: "Telephone"},
        Cellular:   { val: 100000001, name: "Cellular"},
        Email:      { val: 100000002, name: "Email"},
    }
}