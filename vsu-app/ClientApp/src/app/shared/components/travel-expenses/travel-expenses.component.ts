import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from 'moment';
import { TravelExpensesHelper } from "./travel-expenses.helper";
import { TIME } from "../../regex.constants";

const BREAKFAST = 12;
const LUNCH = 13.8;
const DINNER = 23.25;

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

    timeRegex = TIME;

    showContactInfoComments: boolean = false;

    travelPeriodStartDate: Date = null;
    travelPeriodStartDates: Date[] = [];
    travelExpenseHelper: TravelExpensesHelper = new TravelExpensesHelper();

    constructor(private controlContainer: ControlContainer,
        private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("travel expenses component");
        console.log(this.form);

        this.showContactInfoComments = this.form.get('hasContactInfoChanged').value === true;
    }

    hasContactInfoChangedChange(val) {
        this.showContactInfoComments = val;
    }

    travelPeriodStartChange(index: number) {
        console.log(index);
        let travelDate = this.form.get('travelDates')['controls'][index];
        this.travelPeriodStartDates[index] = moment(travelDate.get('travelPeriodStart').value).toDate();
        console.log(this.travelPeriodStartDates[index]);
        let startDate = moment(travelDate.get('travelPeriodStart').value);

        let endDate = travelDate.get('travelPeriodEnd').value;
        if (endDate && moment(endDate).isBefore(startDate)) {
            travelDate.get('travelPeriodEnd').patchValue(null);
        }
    }

    addAdditionalTravelDate() {
        let travelDates = this.form.get('travelDates') as FormArray;
        travelDates.push(this.travelExpenseHelper.addTravelDate(this.fb));
        this.travelPeriodStartDates.push(null);
    }

    removeTravelDate(index: number) {
        let travelDates = this.form.get('travelDates') as FormArray;
        travelDates.removeAt(index);
        this.travelPeriodStartDates.splice(index, 1);
    }

    updateMileageTotal() {
        let mileage = this.form.get('mileage').value;
        let total = mileage * 0.35;
        this.form.get('mileageExpenses').patchValue(total.toFixed(2));
    }

    addOtherTransportationExpense() {
        let otherTransportationExpenses = this.form.get('otherTransportationExpenses') as FormArray;
        otherTransportationExpenses.push(this.travelExpenseHelper.addOtherTransportationExpense(this.fb));
    }

    removeOtherTransportationExpense(index: number) {
        let otherTransportationExpenses = this.form.get('otherTransportationExpenses') as FormArray;
        otherTransportationExpenses.removeAt(index);
    }

    addAccommodationExpense() {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;
        accommodationExpenses.push(this.travelExpenseHelper.addAccommodationExpense(this.fb));
    }

    removeAccommodationExpense(index: number) {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;
        accommodationExpenses.removeAt(index);
    }

    updateAccommodationTotal(index: number) {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;
        let accommodation = accommodationExpenses.controls[index];

        let numberOfNights = accommodation.get('numberOfNights').value || 0;
        let dailyRoomRate = accommodation.get('dailyRoomRate').value || 0;
        let total = numberOfNights * dailyRoomRate;
        accommodation.get('totalExpenses').patchValue(total.toFixed(2));
    }

    addMealExpense() {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;
        mealExpenses.push(this.travelExpenseHelper.addMealExpense(this.fb));
    }

    removeMealExpense(index: number) {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;
        mealExpenses.removeAt(index);
    }

    updateMealTotals() {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;

        let total = 0;
        mealExpenses.controls.forEach(meal => {
            let breakfast = meal.get('breakfast').value || 0;
            let lunch = meal.get('lunch').value || 0;
            let dinner = meal.get('dinner').value || 0;
            let this_total = (breakfast * BREAKFAST) + (lunch * LUNCH) + (dinner * DINNER);
            meal.get('total').patchValue((Math.round(this_total * 100 + Number.EPSILON) / 100).toFixed(2));
            total += this_total;
        });
        this.form.get('mealTotal').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
    }

    addOtherExpense() {
        let otherExpenses = this.form.get('otherExpenses') as FormArray;
        otherExpenses.push(this.travelExpenseHelper.addOtherExpense(this.fb));
    }

    removeOtherExpense(index: number) {
        let otherExpenses = this.form.get('otherExpenses') as FormArray;
        otherExpenses.removeAt(index);
    }

    payChildcareExpensesChange(val: boolean) {
        let children = this.form.get('children') as FormArray;
        if (val == true) {
            children.push(this.travelExpenseHelper.addChild(this.fb));
        }
        else {
            while (children.controls.length > 0) {
                children.removeAt(0);
            }
        }
    }

    addChild() {
        let children = this.form.get('children') as FormArray;
        children.push(this.travelExpenseHelper.addChild(this.fb));
    }

    removeChild(index: number) {
        let children = this.form.get('children') as FormArray;
        children.removeAt(index);
    }
}