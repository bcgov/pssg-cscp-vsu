import { FormBuilder, Validators } from "@angular/forms";
import { EnumHelper } from "../../enums-list";

export class ContactMethodHelper {
    enum = new EnumHelper();
    public createContactMethod(fb: FormBuilder, typeString: string = '') {
        let current_validators = [];
        let label = '';
        let type: number = 0;
        switch (typeString) {
            case 'telephone': {
                type = this.enum.ContactType.Telephone.val;
                current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
                label = 'Telephone Number';
                break;
            }
            case 'mobile': {
                type = this.enum.ContactType.Cellular.val;
                current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
                label = 'Cellular Number';
                break;
            }
            case 'email': {
                type = this.enum.ContactType.Email.val;
                current_validators = current_validators.concat([Validators.email]);
                label = 'Email Address';
                break;
            }
            default: {
                type = this.enum.ContactType.Unset.val;
                break;
            }
        }
        return fb.group({
            type: [type],
            previousType: [type],
            val: ['', current_validators],
            label: [label],
            leaveMessage: [''],
        });
    }
}