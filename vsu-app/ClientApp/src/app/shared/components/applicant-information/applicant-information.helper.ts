import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class ApplicantInfoHelper {
    postalRegex = POSTAL_CODE;
    enum = new EnumHelper();
    public setupFormGroup(fb: FormBuilder): FormGroup {
        let group = {
            applicantType: ['', Validators.required],
            applicantTypeOther: [''],
            applicantInfoSameAsVictim: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            gender: [''],
            genderOther: [''],

            preferredLanguage: ['English'],
            interpreterNeeded: [false],
            address: fb.group({
                line1: ['', [Validators.required]],
                line2: [''],
                city: ['', [Validators.required]],
                postalCode: ['', [Validators.required, Validators.pattern(this.postalRegex)]],
                province: ['British Columbia', [Validators.required]],
                country: ['Canada', [Validators.required]],
            }),

            mayWeSendCorrespondence: [true],
            contactMethods: fb.array([this.createContactMethod(fb, 'telephone'), this.createContactMethod(fb, 'mobile'), this.createContactMethod(fb, 'email')]),
            atLeastOneContactMethod: ['', Validators.required],
        }

        return fb.group(group);
    }

    public createContactMethod(fb: FormBuilder, typeString: string = '') {
        let current_validators = [];
        let label = '';
        let type: number = 0;
        switch (typeString) {
            case 'telephone': {
                type = this.enum.ContactType.Telephone.val;
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                label = 'Telephone Number';
                break;
            }
            case 'mobile': {
                type = this.enum.ContactType.Cellular.val;
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                label = 'Cellular Number';
                break;
            }
            case 'email': {
                type = this.enum.ContactType.Email.val;
                current_validators = [Validators.email];
                label = 'Email Address';
                break;
            }
            default: {
                break;
            }
        }
        return fb.group({
            type: [type],
            val: ['', current_validators],
            label: [label],
            leaveMessage: [0],
        });
    }
}