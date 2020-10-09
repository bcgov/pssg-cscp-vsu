import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class CaseInfoInfoHelper {
    public setupFormGroup(fb: FormBuilder): FormGroup {
        let group = {
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            courtFileNumber: ['', [Validators.required]],
            courtLocation: ['', [Validators.required]],

            accusedFirstName: ['', Validators.required],
            accusedMiddleName: [''],
            accusedLastName: ['', Validators.required],
            accusedBirthDate: [''],

            additionalAccused: fb.array([this.createAdditionalAccused(fb)]),
        }

        return fb.group(group);
    }

    public createAdditionalAccused(fb: FormBuilder) {
        return fb.group({
            name: [''],
            birthDate: [''],
        });
    }
}