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

export enum CRMBoolean {
    True = 100000001,
    False = 100000000,
}
export enum CRMMultiBoolean {
    True = 100000000,
    False = 100000001,
    Undecided = 100000002
}

export enum CommunityStatus {
    Active = 100000000,
    Inactive = 100000001,
}

export class EnumHelper {

    /**
     * Helper to retrieve option set data from just the val number
     */
    public getOptionsSetVal(optionSet: any, val: number): IOptionSetVal {
        return Object.values(optionSet).find((o: IOptionSetVal) => o.val == val) as IOptionSetVal;
    }

    /**
     * Helper to retrieve option set data from the name
     */
    public getOptionsSetValFromName(optionSet: any, name: string): IOptionSetVal {
        return Object.values(optionSet).find((o: IOptionSetVal) => o.name == name) as IOptionSetVal;
    }

    public EventType = {
        KEY_DATE:       <IOptionSetVal> { val: 100000000, name: "KEY_DATE" },
        MOVEMENT:       <IOptionSetVal> { val: 100000001, name: "MOVEMENT" },
        HEARING:        <IOptionSetVal> { val: 100000002, name: "HEARING" },
        STATE_TRAN:     <IOptionSetVal> { val: 100000003, name: "STATE_TRAN" },
        VICT_CNTCT:     <IOptionSetVal> { val: 100000004, name: "VICT_CNTCT" },
        AUTH_DOCM:      <IOptionSetVal> { val: 100000005, name: "AUTH_DOCM" },
    };

    public SearchType = {
        EXACT:       <IOptionSetVal> { val: 100000000, name: "Exact Search" },
        PARTIAL:     <IOptionSetVal> { val: 100000001, name: "Partial Search" },
        SOUNDEX:     <IOptionSetVal> { val: 100000002, name: "Soundex Search" },
    }
    
    public Gender = {
        Male:   <IOptionSetVal> { val: 100000000, name: "M" },
        Female: <IOptionSetVal> { val: 100000001, name: "F" },
        X:      <IOptionSetVal> { val: 100000002, name: "X" },
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
}

export interface IOptionSetVal {
    name: string;
    val: number;
}