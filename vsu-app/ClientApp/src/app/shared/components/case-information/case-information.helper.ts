import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class CaseInfoInfoHelper {
    public setupFormGroup(fb: FormBuilder): FormGroup {
        let group = {
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            genderOther: [''],
            courtInfo: fb.array([this.createCourtInfo(fb)]),

            accusedFirstName: ['', Validators.required],
            accusedMiddleName: [''],
            accusedLastName: ['', Validators.required],
            accusedBirthDate: [''],
            accusedGender: [''],

            additionalAccused: fb.array([this.createAdditionalAccused(fb)]),
        }

        return fb.group(group);
    }

    public createAdditionalAccused(fb: FormBuilder) {
        return fb.group({
            name: [''],
            birthDate: [''],
            gender: [''],
        });
    }

    public createCourtInfo(fb: FormBuilder, location: string = '') {
        return fb.group({
            courtFileNumber: ['', [Validators.required]],
            courtLocation: [location,[Validators.required]],
        });
    }
}