import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";
import { ContactMethodHelper } from "../contact-method/contact-method.helper";

export class RecipientDetailsHelper {
    postalRegex = POSTAL_CODE;
    enum = new EnumHelper();
    contactMethodHelper = new ContactMethodHelper();
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            notificationRecipient: ['', Validators.required],

            victimServiceWorker: fb.array([]),
            designate: fb.array([]),

            courtUpdates: [''],
            courtResults: [''],
            courtAppearances: [''],
            courtOrders: [''],
            correctionsInformation: [''],
            atLeastOneNotification: ['', Validators.required],
            additionalComments: [''],
        }

        return fb.group(group);
    }

    // public createContactMethod(fb: FormBuilder, typeString: string = '') {
    //     let current_validators = [];
    //     let label = '';
    //     let type: number;
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

    public createVictimServiceWorker(fb: FormBuilder) {
        return fb.group({
            firstName: ['', [Validators.required]],
            lastName: [''],
            organization: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            extension: [''],
            email: [''],
            city: [''],
        });
    }

    public createDesignate(fb: FormBuilder) {
        return fb.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            relationship: [''],

            addressSameAsApplicant: [false],
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
        });
    }
}