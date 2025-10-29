export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export const FORM_TITLES = {
  NOTIFICATION_APPLICATION: 'Victim Safety Unit - Notification Application Form',
  TRAVEL_FUNDS_APPLICATION: 'Victim Safety Unit - Victim Travel Fund Application Form',
  TRAVEL_FUNDS_REIMBURSEMENT: 'Victim Safety Unit - Victim Travel Fund Reimbursement Form'
};

export const FORM_TYPES = {
  NOTIFICATION_APPLICATION: { val: 100000000, name: 'Victim Service Notification' },
  TRAVEL_FUNDS_APPLICATION: { val: 100000001, name: 'Victim Travel Fund' },
  TRAVEL_FUNDS_REIMBURSEMENT: { val: 100000002, name: 'Victim Travel Fund Reimbursement' }
};

export const PARTICIPANT_TYPES = {
  ACCUSED: 'Subject',
  CROWN_COUNSEL: 'Crown Counsel',
  DESIGNATE: 'Designate',
  COURT_SUPPORT_CASE_WORKER: 'Court Support Caseworker',
  MINISTRY_OF_CHILDREN_AND_FAMILY_DEVELOPMENT: 'MCFD',
  VICTIM_SERVICE_WORKER: 'Victim Service Worker'
};

export enum ApplicationType {
  NOTIFICATION = 100000000,
  TRAVEL_FUNDS = 100000001,
  TRAVEL_REIMBURSEMENT = 100000002 //TODO - check if this is right
}

export class EnumHelper {
  public ApplicantType = {
    Victim: { val: 100000000, name: 'Victim' },
    Civil_Protected_Party: { val: 100000001, name: 'Civil Protected Party' },
    Victim_Parent: { val: 100000002, name: "Victim's Parent / Guardian" },
    Other_Family_Member: { val: 100000003, name: 'Other Family Member' },
    Support_Person: { val: 100000004, name: 'Support Person' },
    Immediate_Family_Member: { val: 100000005, name: 'Immediate family member of the deceased victim' },
    Victim_Service_Worker: { val: 100000006, name: 'Victim Service Worker' }
  };

  public NotificationRecipientEnum = {
    Myself: { val: 100000000, name: 'Victim' },
    Designate: { val: 100000001, name: 'Civil Protected Party' },
    Victim_Service_Worker: { val: 100000002, name: "Victim's Parent / Guardian" },
    Myself_And_Designate: { val: 100000003, name: 'Other Family Member' },
    Myself_And_Victim_Service_Worker: { val: 100000004, name: 'Other Family Member' },
    Designate_And_Victim_Service_Worker: { val: 100000005, name: 'Other Family Member' }
  };

  public IndigenousStatus = {
    BLANK: { val: 0, name: 'Select...' },
    First_Nations: { val: 100000000, name: 'First Nations' },
    Metis: { val: 100000001, name: 'Métis' },
    Inuit: { val: 100000002, name: 'Inuit' },
    Prefer_Not_To_Answer: { val: 100000003, name: 'Prefer Not to Answer' },
    Not_Applicable: { val: 100000004, name: 'Not Applicable' }
  };

  public Gender = {
    Male: { val: 100000000, name: 'M' },
    Female: { val: 100000001, name: 'F' },
    X: { val: 100000002, name: 'X' }
  };

  public Boolean = {
    True: { val: 100000001, name: 'True' },
    False: { val: 100000000, name: 'False' }
  };

  public MultiBoolean = {
    True: { val: 100000000, name: 'True' },
    False: { val: 100000001, name: 'False' },
    Undecided: { val: 100000002, name: 'Undecided' }
  };

  public ContactType = {
    Telephone: { val: 100000000, name: 'Telephone' },
    Cellular: { val: 100000001, name: 'Cellular' },
    Email: { val: 100000002, name: 'Email' },
    Unset: { val: null, name: '' }
  };

  //for Application Requested Expenses
  public TravelExpenses = {
    Accommodation: { val: 100000006, name: 'Accommodation' },
    TransportationBus: { val: 100000000, name: 'Transportation - Bus' },
    TransportationFerry: { val: 100000001, name: 'Transportation - Ferry' },
    TransportationFlights: { val: 100000002, name: 'Transportation - Flights' },
    TransportationMileage: { val: 100000003, name: 'Transportation - Mileage' },
    TransportationOther: { val: 100000004, name: 'Transportation - Other' },
    Meals: { val: 100000005, name: 'Meals' },
    Other: { val: 100000007, name: 'Other' }
  };

  //For Travel Expense Type on Invoice Line Detail
  public TravelExpenseType = {
    Accommodation: { val: 100000001, name: 'Accommodation' },
    Childcare: { val: 100000006, name: 'Childcare' },
    Meal_Breakfast: { val: 100000002, name: 'Meal - Breakfast' },
    Meal_Dinner: { val: 100000005, name: 'Meal - Dinner' },
    Meal_Lunch: { val: 100000004, name: 'Meal - Lunch' },
    Transportation: { val: 100000000, name: 'Transportation' },
    Other: { val: 100000003, name: 'Other' }
  };

  public TransportationType = {
    NONE: { val: 0, name: '' },
    Mileage: { val: 100000000, name: 'Mileage' },
    Air: { val: 100000001, name: 'Air' },
    Bus: { val: 100000002, name: 'Bus' },
    Taxi: { val: 100000003, name: 'Taxi' },
    Ferry: { val: 100000004, name: 'Ferry' },
    Parking: { val: 100000005, name: 'Parking' },
    Other: { val: 100000006, name: 'Other' }
  };

  public Gender_V2 = {
    Man_Boy: {
      val: 100000000,
      name: 'Man/Boy (M)',
      tooltip: 'Persons whose current gender is male. This includes cisgender and transgender persons who are male.'
    },
    Non_Binary: {
      val: 100000002,
      name: 'Non-Binary (X)',
      tooltip:
        'Persons whose current gender is not exclusively male or female. It includes people who are unsure of their gender, do not have one gender, have no gender, are gender fluid, or are Two-Spirit.'
    },
    Woman_Girl: {
      val: 100000001,
      name: 'Woman/Girl (F)',
      tooltip: 'Persons whose current gender is female. This includes cisgender and transgender persons who are female.'
    },
    Prefer_Not_To_Answer: { val: 100000003, name: 'Prefer not to answer (U)' },
    Prefer_To_Self_Describe: { val: 100000004, name: 'Prefer to self-describe' }
  };

  public Pronouns_V2 = {
    He_Him_His: { val: 100000001, name: 'He/Him/His' },
    She_Her_Hers: { val: 100000000, name: 'She/Her/Hers' },
    They_Them_Theirs: { val: 100000002, name: 'They/Them/Theirs' },
    Other: { val: 100000003, name: 'Other' }
  };

  public RaceEthnicity_V2 = {
    Black: { val: 100000000, name: 'Black' },
    Chinese: { val: 100000001, name: 'Chinese' },
    Japanese: { val: 100000002, name: 'Japanese' },
    Korean: { val: 100000003, name: 'Korean' },
    Filipino: { val: 100000004, name: 'Filipino' },
    Southeast_Asian: { val: 100000005, name: 'Southeast Asian' },
    Latin_American: { val: 100000006, name: 'Latin American' },
    Arab: { val: 100000007, name: 'Arab' },
    West_Asian: { val: 100000008, name: 'West Asian' },
    South_Asian: { val: 100000009, name: 'South Asian' },
    White: { val: 100000010, name: 'White' },
    Other: { val: 100000011, name: 'Other' },
    Multiple: { val: 100000012, name: 'Multiple' },
    Indigenous: { val: 100000013, name: 'Indigenous' }
  };
}
