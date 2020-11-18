import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class AuthInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let today = new Date();
        let group = {
            registerForVictimNotification: [''],
            permissionToShareContactInfo: [''],
            permissionToContactMyVSW: [''],
            declaration: ['', Validators.required],
            fullName: ['', Validators.required],
            date: [today, Validators.required],
            signature: ['', Validators.required],
        };

        return fb.group(group);
    }
}
