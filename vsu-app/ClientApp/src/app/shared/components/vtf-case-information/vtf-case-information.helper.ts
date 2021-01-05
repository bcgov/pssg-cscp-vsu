import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class VTFCaseInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            vtfCaseNumber: ['', [Validators.required]]
        };

        return fb.group(group);
    }
}
