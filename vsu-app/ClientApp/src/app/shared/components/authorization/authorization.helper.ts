import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

export class AuthInfoHelper {
    public setupFormGroup(fb: FormBuilder): FormGroup {
        let today = new Date();
        let dateString = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
        let group = {
            registerForVictimNotification: [''],
            permissionToShareContactInfo: [''],
            permissionToContactMyVSW: [''],
            declaration: ['', Validators.required],
            fullName: ['', Validators.required],
            date: [dateString, Validators.required],
            signature: ['', Validators.required],
            additionalComments: ['']
        };

        return fb.group(group);
    }
}
