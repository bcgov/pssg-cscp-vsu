import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { TravelInfoHelper } from "./travel-information.helper";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from 'moment';

@Component({
    selector: 'app-travel-information',
    templateUrl: './travel-information.component.html',
    styleUrls: ['./travel-information.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class TravelInformationComponent extends FormBase implements OnInit {
    @Input() isDisabled: boolean = false;
    @Input() lookupData: iLookupData;
    @Input() formType: ApplicationType;
    public form: FormGroup;

    today = new Date();
    travelPeriodStartDate: Date = null;
    travelPeriodStartDates: Date[] = [];

    EXPENSES: string[];

    travelInfoHelper = new TravelInfoHelper();

    constructor(private controlContainer: ControlContainer,
        private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("travel info component");
        console.log(this.form);

        if (this.formType === ApplicationType.TRAVEL_FUNDS) {
            this.EXPENSES = [
                'applyForTransportationBus',
                'applyForTransportationFerry',
                'applyForTransportationFlights',
                'applyForTransportationMileage',
                'applyForTransportationOther',
                'applyForMeals',
                'applyForAccommodation',
                'applyForOther',
            ];
        }
    }

    addAdditionalCourtDate() {
        let courtDates = this.form.get('courtDates') as FormArray;
        courtDates.push(this.travelInfoHelper.addCourtDate(this.fb));
        this.travelPeriodStartDates.push(null);
    }

    removeCourtDate(index: number) {
        let courtDates = this.form.get('courtDates') as FormArray;
        courtDates.removeAt(index);
        this.travelPeriodStartDates.splice(index, 1);
    }

    changeGroupValidity(): void {
        let x: AbstractControl[] = [];
        this.EXPENSES.forEach((benefit) => {
            x.push(this.form.get(benefit));
        });
        let oneChecked = false;
        x.forEach(c => {
            if (c instanceof FormControl && c.value === true) {
                oneChecked = true;
                return;
            }
        });
        this.form.patchValue({
            atLeastOneExpense: oneChecked
        });

        if (this.form.get('applyForOther').value !== true) {
            this.form.get('applyForOtherText').patchValue('')
        }
        if (this.form.get('applyForTransportationOther').value !== true) {
            this.form.get('applyForTransportationOtherText').patchValue('')
        }
    }

    travelPeriodStartChange(index: number) {
        console.log(index);
        let courtDate = this.form.get('courtDates')['controls'][index];
        this.travelPeriodStartDates[index] = moment(courtDate.get('travelPeriodStart').value).toDate();
        console.log(this.travelPeriodStartDates[index]);
        let startDate = moment(courtDate.get('travelPeriodStart').value);

        let endDate = courtDate.get('travelPeriodEnd').value;
        if (endDate && moment(endDate).isBefore(startDate)) {
            courtDate.get('travelPeriodEnd').patchValue(null);
        }
    }
}