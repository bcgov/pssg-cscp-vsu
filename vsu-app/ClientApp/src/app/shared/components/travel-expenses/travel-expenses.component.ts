import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from 'moment';

@Component({
    selector: 'app-travel-expenses',
    templateUrl: './travel-expenses.component.html',
    styleUrls: ['./travel-expenses.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class TravelExpensesComponent extends FormBase implements OnInit {
    @Input() isDisabled: boolean = false;
    @Input() lookupData: iLookupData;
    @Input() formType: ApplicationType;
    public form: FormGroup;

    today = new Date();
    travelPeriodStartDate: Date = null;
    travelPeriodStartDates: Date[] = [];

    constructor(private controlContainer: ControlContainer,
        private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("travel expenses component");
        console.log(this.form);
    }
   
}