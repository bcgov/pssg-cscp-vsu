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

            designate: fb.array([]),
            addOptionalVSW: [false],
            vswIsOptionalPreviousSelection: [false],
            victimServiceWorker: fb.array([]),

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

    public createVictimServiceWorker(fb: FormBuilder, org_and_tel_required: boolean = true) {
        let org_and_tel_validators = org_and_tel_required ? [Validators.required] : [];
        return fb.group({
            firstName: ['', [Validators.required]],
            lastName: [''],
            organization: ['', org_and_tel_validators],
            telephone: ['', org_and_tel_validators],
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