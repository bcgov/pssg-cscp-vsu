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
    TRAVEL_FUNDS_REIMBURSEMENT: "Victim Safety Unit - Victim Travel Fund Reimbursement Form",
};

export const FORM_TYPES = {
    NOTIFICATION_APPLICATION:   <IOptionSetVal> { val: 100000000, name: "Victim Service Notification" },
    TRAVEL_FUNDS_APPLICATION:   <IOptionSetVal> { val: 100000001, name: "Victim Travel Fund",  },
    TRAVEL_FUNDS_REIMBURSEMENT: <IOptionSetVal> { val: 100000002, name: "Victim Travel Fund Reimbursement",  },
};

export enum ApplicationType {
    NOTIFICATION =          100000000,
    TRAVEL_FUNDS =          100000001,
    TRAVEL_REIMBURSEMENT =  100000002, //TODO - check if this is right
}

export class EnumHelper {
    public ApplicantType = {
        Victim:                     <IOptionSetVal> { val: 100000000, name: "Victim" },
        Civil_Protected_Party:      <IOptionSetVal> { val: 100000001, name: "Civil Protected Party" },
        Victim_Parent:              <IOptionSetVal> { val: 100000002, name: "Victim's Parent / Guardian" },
        Other_Family_Member:        <IOptionSetVal> { val: 100000003, name: "Other Family Member" },
        Support_Person:             <IOptionSetVal> { val: 100000004, name: "Support Person" },
        Immediate_Family_Member:    <IOptionSetVal> { val: 100000005, name: "Immediate family member of the deceased victim" },
        Victim_Service_Worker:      <IOptionSetVal> { val: 100000006, name: "Victim Services Worker" },
    };

    public NotificationRecipientEnum = {
        Myself:                                 <IOptionSetVal> { val: 100000000, name: "Victim" },
        Designate:                              <IOptionSetVal> { val: 100000001, name: "Civil Protected Party" },
        Victim_Service_Worker:                  <IOptionSetVal> { val: 100000002, name: "Victim's Parent / Guardian" },
        Myself_And_Designate:                   <IOptionSetVal> { val: 100000003, name: "Other Family Member" },
        Myself_And_Victim_Service_Worker:       <IOptionSetVal> { val: 100000004, name: "Other Family Member" },
        Designate_And_Victim_Service_Worker:    <IOptionSetVal> { val: 100000005, name: "Other Family Member" },
    };

    public Gender = {
        Male:   <IOptionSetVal> { val: 100000000, name: "M" },
        Female: <IOptionSetVal> { val: 100000001, name: "F" },
        X:      <IOptionSetVal> { val: 100000002, name: "X" },
    };

    public GenderCode = {
        Male:   <IOptionSetVal> { val: 1,         name: "M" },
        Female: <IOptionSetVal> { val: 2,         name: "F" },
        X:      <IOptionSetVal> { val: 100000000, name: "X" },
    };

    public Boolean = {
        True:   <IOptionSetVal> { val: 100000001, name: "True"},
        False:  <IOptionSetVal> { val: 100000000, name: "False"},
    }

    public MultiBoolean = {
        True:       <IOptionSetVal> { val: 100000000, name: "True"},
        False:      <IOptionSetVal> { val: 100000001, name: "False"},
        Undecided:  <IOptionSetVal> { val: 100000002, name: "Undecided"},
    }

    public ContactType = {
        Telephone:  <IOptionSetVal> { val: 100000000, name: "Telephone"},
        Cellular:   <IOptionSetVal> { val: 100000001, name: "Cellular"},
        Email:      <IOptionSetVal> { val: 100000002, name: "Email"},
        Unset:      <IOptionSetVal> { val: null, name: ""},
    }

    public TravelExpenses = {
        Accommodation:          <IOptionSetVal> { val: 100000006, name: "Accommodation"},
        TransportationBus:      <IOptionSetVal> { val: 100000000, name: "Transportation - Bus"},
        TransportationFerry:    <IOptionSetVal> { val: 100000001, name: "Transportation - Ferry"},
        TransportationFlights:  <IOptionSetVal> { val: 100000002, name: "Transportation - Flights"},
        TransportationMileage:  <IOptionSetVal> { val: 100000003, name: "Transportation - Mileage"},
        TransportationOther:    <IOptionSetVal> { val: 100000004, name: "Transportation - Other"},
        Meals:                  <IOptionSetVal> { val: 100000005, name: "Meals"},
        Other:                  <IOptionSetVal> { val: 100000007, name: "Other"},
    }
}

interface IOptionSetVal {
    name: string;
    val: number;
}