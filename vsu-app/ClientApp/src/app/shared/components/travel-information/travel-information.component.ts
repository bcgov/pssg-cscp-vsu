import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
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
        let expenses = this.form.get('expenses') as FormGroup;

        let oneChecked = false;
        for (let ex in expenses.controls) {
            if (expenses.controls[ex].value === true) {
                oneChecked = true;
                break;
            }
        }

        this.form.patchValue({
            atLeastOneExpense: oneChecked
        });

        if (expenses.get('applyForOther').value !== true) {
            expenses.get('applyForOtherText').patchValue('')
        }
        if (expenses.get('applyForTransportationOther').value !== true) {
            expenses.get('applyForTransportationOtherText').patchValue('')
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