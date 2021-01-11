import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class ApplicantInfoHelper {
    postalRegex = POSTAL_CODE;
    enum = new EnumHelper();
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            applicantType: ['', Validators.required],
            applicantTypeOther: [''],
            applicantInfoSameAsVictim: [false],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            genderOther: [''],

            preferredLanguage: ['English'],
            interpreterNeeded: [this.enum.Boolean.False.val],
            address: fb.group({
                line1: ['', [Validators.required]],
                line2: [''],
                city: ['', [Validators.required]],
                postalCode: ['', [Validators.required, Validators.pattern(this.postalRegex)]],
                province: ['British Columbia', [Validators.required]],
                country: ['Canada', [Validators.required]],
            }),

            mayWeSendCorrespondence: [this.enum.Boolean.True.val],
            contactMethods: fb.array([this.createContactMethod(fb, '', true), this.createContactMethod(fb), this.createContactMethod(fb)]),
            atLeastOneContactMethod: ['', Validators.required],
        }

        if (form_type === ApplicationType.TRAVEL_FUNDS) {
            group['vswComment'] = [''];
            group['coveredByVictimServiceProgram'] = [null];
            group['coveredByVictimServiceProgramComment'] = [''];

            group['victimServiceWorker'] = fb.array([]);
            // group['managerFirstName'] = [''];
            // group['managerLastName'] = [''];
            // group['agencyName'] = [''];
            // group['managerPhone'] = [''];
            // group['managerEmail'] = ['', [Validators.email]];

            group['victimAlreadySubmitted'] = [null];
            group['victimAlreadySubmittedComment'] = [''];
            group['otherFamilyAlsoApplying'] = [null];
            group['otherFamilyAlsoApplyingComment'] = [''];
            group['gender'] = ['', Validators.required];
            group['supportPersonRelationship'] = [''];
            group['IFMRelationship'] = [''];
        }
        else if (form_type === ApplicationType.NOTIFICATION) {
            group['gender'] = [''];
        }

        return fb.group(group);
    }

    public createVSW(fb: FormBuilder) {
        return fb.group({
            firstName: [''],
            lastName: [''],
            organization: [''],
            telephone: [''],
            extension: [''],
            email: ['', [Validators.email]],
            city: [''],
        });
    }

    public createContactMethod(fb: FormBuilder, typeString: string = '', required: boolean = false) {
        let current_validators = [];
        let typeAndMessageValidators = [];
        if (required) {
            current_validators = [Validators.required];
            typeAndMessageValidators = [Validators.required];
        }
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
            type: [type, typeAndMessageValidators],
            previousType: [type],
            val: ['', current_validators],
            label: [label],
            leaveMessage: ['', typeAndMessageValidators],
        });
    }
}