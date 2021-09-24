import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { iOffence } from "../../interfaces/lookup-data.interface";

export class CaseInfoInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            gender: [null],
            genderOther: [''],
            victimInfoSameAsApplicant: [''],
            courtInfo: fb.array([this.createCourtInfo(fb)]),

            accusedFirstName: ['', Validators.required],
            accusedMiddleName: [''],
            accusedLastName: ['', Validators.required],
            accusedBirthDate: [''],
            accusedGender: [''],
            accusedRelationship: [''],

            additionalAccused: fb.array([]),//fb.array([this.createAdditionalAccused(fb)]),
        }

        if (form_type === ApplicationType.TRAVEL_FUNDS) {
            // group['offence'] = ['', Validators.required];
            group['offence'] = [''];
            group['offences'] = fb.array([]);
            group['crownCounsel'] = fb.array([this.createCrownCounsel(fb)]);
            group['victimServiceWorker'] = fb.array([this.createVictimServiceWorker(fb)]);
        }

        return fb.group(group);
    }

    public createAdditionalAccused(fb: FormBuilder) {
        return fb.group({
            firstName: ['', [Validators.required]],
            middleName: [''],
            lastName: ['', [Validators.required]],
            birthDate: [''],
            gender: [''],
            relationship: [''],
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
            okToDiscussTravel: ['']
        });
    }

    public createOffence(fb: FormBuilder, offence: iOffence) {
        return fb.group({
            id: [offence.vsd_offenseid],
            name: [offence.vsd_name],
            criminal_code: [offence.vsd_criminalcode],
            checked: [false]
        });
    }
}