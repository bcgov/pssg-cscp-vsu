import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class CaseInfoInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            genderOther: [''],
            victimInfoSameAsApplicant: [''],
            courtInfo: fb.array([this.createCourtInfo(fb)]),

            accusedFirstName: ['', Validators.required],
            accusedMiddleName: [''],
            accusedLastName: ['', Validators.required],
            accusedBirthDate: [''],
            accusedGender: [''],

            additionalAccused: fb.array([this.createAdditionalAccused(fb)]),
        }

        if (form_type === ApplicationType.TRAVEL_FUNDS) {
            group['offence'] = ['', Validators.required];
            group['crownCounsel'] = fb.array([this.createCrownCounsel(fb)]);
            group['victimServiceWorker'] = fb.array([this.createVictimServiceWorker(fb)]);
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
            courtLocation: [location, [Validators.required]],
        });
    }

    public createCrownCounsel(fb: FormBuilder) {
        return fb.group({
            firstName: [''],
            lastName: [''],
            telephone: [''],
        });
    }

    public createVictimServiceWorker(fb: FormBuilder) {
        return fb.group({
            firstName: [''],
            lastName: [''],
            organization: [''],
            telephone: [''],
            extension: [''],
            email: [''],
            city: [''],
            okToDiscussTravel: ['', Validators.required]
        });
    }

    checkFormGroupHasValue(form: FormGroup) {
        return Object.values(form.controls).some(({ value }) => !!value);
    }
}