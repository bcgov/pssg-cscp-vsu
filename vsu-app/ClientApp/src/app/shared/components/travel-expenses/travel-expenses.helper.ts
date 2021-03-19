import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class TravelExpensesHelper {
    enum = new EnumHelper();
    postalRegex = POSTAL_CODE;
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            hasContactInfoChanged: [false],
            contactInfoComments: [''],

            travelDates: fb.array([this.addTravelDate(fb)]),

            transportationExpenses: fb.array([this.addTransportationExpense(fb)]),
            transportationTotal: [{ value: 0, disabled: true }],
            accommodationExpenses: fb.array([this.addAccommodationExpense(fb)]),
            accommodationTotal: [{ value: 0, disabled: true }],
            mealExpenses: fb.array([this.addMealExpense(fb)], [Validators.required]),
            mealTotal: [{ value: 0, disabled: true }],
            otherExpenses: fb.array([this.addOtherExpense(fb)]),
            otherTotal: [{ value: 0, disabled: true }],

            didYouPayChildcareExpenses: [false],
            children: fb.array([]),

            subTotal: [{ value: 0, disabled: true }],

            travelAdvanceAlreadyPaid: [''],
            totalReimbursementClaim: [{ value: 0, disabled: true }],
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

    addTransportationExpense(fb: FormBuilder) {
        let group = {
            type: [0],
            amount: [''],
            mileage: [''],
        };

        return fb.group(group);
    }

    addAccommodationExpense(fb: FormBuilder) {
        let group = {
            type: [''],
            numberOfNights: [''],
            totalExpenses: [{ value: 0, disabled: true }],
        };

        return fb.group(group);
    }

    addMealExpense(fb: FormBuilder) {
        let group = {
            date: [''],
            breakfast: [''],
            lunch: [''],
            dinner: [''],
            total: [{ value: 0, disabled: true }],
        };

        return fb.group(group);
    }

    addOtherExpense(fb: FormBuilder) {
        let group = {
            description: [''],
            amount: [''],
        };

        return fb.group(group);
    }

    addChild(fb: FormBuilder) {
        let group = {
            age: ['', [Validators.required]],
            startDate: [''],
            endDate: [''],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            address: fb.group({
                line1: ['', [Validators.required]],
                line2: [''],
                city: ['', [Validators.required]],
                postalCode: ['', [Validators.required, Validators.pattern(this.postalRegex)]],
                province: ['British Columbia', [Validators.required]],
                country: ['Canada', [Validators.required]],
            }),
            childcareProviderGSTNumber: [''],
            amountPaid: ['', [Validators.required]],
        };

        return fb.group(group);
    }
}