import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";
import { ContactMethodHelper } from "../contact-method/contact-method.helper";

export class ApplicantInfoHelper {
    postalRegex = POSTAL_CODE;
    enum = new EnumHelper();
    contactMethodHelper = new ContactMethodHelper();
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            applicantType: ['', Validators.required],
            applicantTypeOther: [''],
            applicantInfoSameAsVictim: [false],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            birthDate: ['', [Validators.required]],
            gender: ['', [Validators.required]],
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
            contactMethods: fb.array([this.contactMethodHelper.createContactMethod(fb), this.contactMethodHelper.createContactMethod(fb), this.contactMethodHelper.createContactMethod(fb)]),
            atLeastOneContactMethod: ['', Validators.required],
        }

        if (form_type === ApplicationType.TRAVEL_FUNDS) {
            group['vswComment'] = [''];
            group['coveredByVictimServiceProgram'] = [null];
            group['coveredByVictimServiceProgramComment'] = [''];

            group['victimServiceWorker'] = fb.array([]);

            group['victimAlreadySubmitted'] = [null];
            group['victimAlreadySubmittedComment'] = [''];
            group['otherFamilyAlsoApplying'] = [null];
            group['otherFamilyAlsoApplyingComment'] = [''];
            group['supportPersonRelationship'] = [''];
            group['IFMRelationship'] = [''];
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

    // public createContactMethod(fb: FormBuilder, typeString: string = '') {
    //     let current_validators = [];
    //     let label = '';
    //     let type: number = 0;
    //     switch (typeString) {
    //         case 'telephone': {
    //             type = this.enum.ContactType.Telephone.val;
    //             current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
    //             label = 'Telephone Number';
    //             break;
    //         }
    //         case 'mobile': {
    //             type = this.enum.ContactType.Cellular.val;
    //             current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
    //             label = 'Cellular Number';
    //             break;
    //         }
    //         case 'email': {
    //             type = this.enum.ContactType.Email.val;
    //             current_validators = current_validators.concat([Validators.email]);
    //             label = 'Email Address';
    //             break;
    //         }
    //         default: {
    //             type = this.enum.ContactType.Unset.val;
    //             break;
    //         }
    //     }
    //     return fb.group({
    //         type: [type],
    //         previousType: [type],
    //         val: ['', current_validators],
    //         label: [label],
    //         leaveMessage: [''],
    //     });
    // }
}