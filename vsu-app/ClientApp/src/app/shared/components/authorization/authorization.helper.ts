import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class AuthInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let today = new Date();
        let group = {
            declaration: ['', Validators.requiredTrue],
            fullName: ['', Validators.required],
            date: [today, Validators.required],
            signature: ['', Validators.required],
        };

        if (form_type === ApplicationType.NOTIFICATION) {
            group['registerForVictimNotification'] = [''];
            group['permissionToShareContactInfo'] = [''];
            group['permissionToContactMyVSW'] = [''];
        }

        if (form_type === ApplicationType.TRAVEL_REIMBURSEMENT) {
            group['documents'] = fb.array([]);
            group['subTotal'] = [{ value: 0, disabled: true }];
            group['travelAdvanceAlreadyPaid'] = [''];
            group['totalReimbursementClaim'] = [{ value: 0, disabled: true }];
        }

        return fb.group(group);
    }
}
