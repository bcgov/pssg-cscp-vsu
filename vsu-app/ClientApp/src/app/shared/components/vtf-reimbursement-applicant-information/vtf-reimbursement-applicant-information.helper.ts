import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class VTFReimbursementApplicantInfoHelper {
    postalRegex = POSTAL_CODE;
    enum = new EnumHelper();
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],

            address: fb.group({
                line1: ['', [Validators.required]],
                line2: [''],
                city: ['', [Validators.required]],
                postalCode: ['', [Validators.required, Validators.pattern(this.postalRegex)]],
                province: ['British Columbia', [Validators.required]],
                country: ['Canada', [Validators.required]],
            }),

            hasContactInfoChanged: [false],
            contactInfoComments: [''],
            travelDates: fb.array([this.addTravelDate(fb)]),
        }

        return fb.group(group);
    }

    addTravelDate(fb: FormBuilder) {
        return fb.group({
            purposeOfTravel: ['', Validators.required],
            travelPeriodStart: ['', Validators.required],
            startTime: [''],
            startAMPM: ['AM'],
            travelPeriodEnd: ['', Validators.required],
            endTime: [''],
            endAMPM: ['AM'],
        });
    }
}