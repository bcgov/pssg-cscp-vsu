import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class TravelInfoHelper {
    enum = new EnumHelper();
    postalRegex = POSTAL_CODE;
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            expenses: fb.group({
                applyForAccommodation: [''],
                applyForTransportationBus: [''],
                applyForTransportationFerry: [''],
                applyForTransportationFlights: [''],
                applyForTransportationMileage: [''],
                applyForTransportationOther: [''],
                applyForMeals: [''],
                applyForOther: [''],
                applyForTransportationOtherText: [''],
                applyForOtherText: [''],
            }),
            atLeastOneExpense: ['', Validators.requiredTrue],

            courtDates: fb.array([this.addCourtDate(fb)]),

            additionalComments: [''],
        }
        return fb.group(group);
    }

    addCourtDate(fb: FormBuilder) {
        return fb.group({
            courtDate: ['', Validators.required],
            purposeOfTravel: ['', Validators.required],
            travelPeriodStart: ['', Validators.required],
            travelPeriodEnd: ['', Validators.required],
        });
    }
}