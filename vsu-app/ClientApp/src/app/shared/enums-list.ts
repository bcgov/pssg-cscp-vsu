export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY/MM/DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

export const FORM_TITLES = {
    NOTIFICATION_APPLICATION: "Victim Safety Unit - Notification Application Form",
    TRAVEL_FUNDS_APPLICATION: "Victim Safety Unit - Victim Travel Fund Application Form",
};

export const FORM_TYPES: ICRMOptionSet = {
    NOTIFICATION_APPLICATION: { val: 100000000, name: "Victim Service Notification" },
    TRAVEL_FUNDS_APPLICATION: { val: 100000001, name: "Victim Travel Fund",  },
};

export enum ApplicationType {
    NOTIFICATION = 100000000,
    TRAVEL_FUNDS = 100000001
}

export class EnumHelper {
    public ApplicantType: ICRMOptionSet = {
        Victim:                     { val: 100000000, name: "Victim" },
        Civil_Protected_Party:      { val: 100000001, name: "Civil Protected Party" },
        Victim_Parent:              { val: 100000002, name: "Victim's Parent / Guardian" },
        Other_Family_Member:        { val: 100000003, name: "Other Family Member" },
        Support_Person:             { val: 100000004, name: "Support Person" },
        Immediate_Family_Member:    { val: 100000005, name: "Immediate family member of the deceased victim" },
    };

    public NotificationRecipientEnum: ICRMOptionSet = {
        Myself:                                 { val: 100000000, name: "Victim" },
        Designate:                              { val: 100000001, name: "Civil Protected Party" },
        Victim_Service_Worker:                  { val: 100000002, name: "Victim's Parent / Guardian" },
        Myself_And_Designate:                   { val: 100000003, name: "Other Family Member" },
        Myself_And_Victim_Service_Worker:       { val: 100000004, name: "Other Family Member" },
        Designate_And_Victim_Service_Worker:    { val: 100000005, name: "Other Family Member" },
    };

    public Gender: ICRMOptionSet = {
        Male:   { val: 100000000, name: "M" },
        Female: { val: 100000001, name: "F" },
        X:      { val: 100000002, name: "X" },
      };

    public Boolean: ICRMOptionSet = {
        True:   { val: 100000001, name: "True"},
        False:  { val: 100000000, name: "False"},
    }

    public MultiBoolean: ICRMOptionSet = {
        True:       { val: 100000000, name: "True"},
        False:      { val: 100000001, name: "False"},
        Undecided:  { val: 100000002, name: "Undecided"},
    }

    public ContactType: ICRMOptionSet = {
        Telephone:  { val: 100000000, name: "Telephone"},
        Cellular:   { val: 100000001, name: "Cellular"},
        Email:      { val: 100000002, name: "Email"},
        Unset:      { val: null, name: ""},
    }
}

export interface ICRMOptionSet {
   [key: string]: { name: string, val: number };
}