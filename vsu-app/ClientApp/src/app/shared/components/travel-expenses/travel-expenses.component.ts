import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from 'moment';
import { TravelExpensesHelper } from "./travel-expenses.helper";
import { TIME } from "../../regex.constants";

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

    transportationTypeChange(index: number) {
        let transportationExpenses = this.form.get('transportationExpenses') as FormArray;
        let group = transportationExpenses.controls[index];
        if (group.get('type').value === "vehicle") {
            if (group.get("amount").enabled) {
                //we went from non vehicle to vehicle -> clear the amount
                group.get("amount").patchValue('');
                group.get("mileage").patchValue('');
                this.updateTransportationTotals();

            }
            group.get("amount").disable();
        }
        else {
            if (group.get("amount").disabled) {
                //we went from vehicle to non vehicle -> clear the amount
                group.get("amount").patchValue('');
                group.get("mileage").patchValue('');
                this.updateTransportationTotals();
            }
            group.get("amount").enable();
        }
    }

    updateMileageTotal(index: number) {
        let transportationExpenses = this.form.get('transportationExpenses') as FormArray;
        let mileage = transportationExpenses.controls[index].get('mileage').value;
        let total = mileage * this.lookupData.expenseRates.mileage;
        transportationExpenses.controls[index].get('amount').patchValue(total.toFixed(2));
        this.updateTransportationTotals();
    }

    addTransportationExpense() {
        let transportationExpenses = this.form.get('transportationExpenses') as FormArray;
        transportationExpenses.push(this.travelExpenseHelper.addTransportationExpense(this.fb));
    }

    removeTransportationExpense(index: number) {
        let transportationExpenses = this.form.get('transportationExpenses') as FormArray;
        transportationExpenses.removeAt(index);
        this.updateTransportationTotals();
    }

    updateTransportationTotals() {
        let transportationExpenses = this.form.get('transportationExpenses') as FormArray;

        let total = 0;
        transportationExpenses.controls.forEach(expense => {
            let amount = expense.get('amount').value || 0;
            total += parseFloat(amount);
        });
        this.form.get('transportationTotal').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
        this.updateSubTotal();
    }

    addAccommodationExpense() {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;
        accommodationExpenses.push(this.travelExpenseHelper.addAccommodationExpense(this.fb));
    }

    removeAccommodationExpense(index: number) {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;
        accommodationExpenses.removeAt(index);
        this.updateAccommodationTotals();
    }

    updateAccommodationTotals() {
        let accommodationExpenses = this.form.get('accommodationExpenses') as FormArray;

        let total = 0;
        accommodationExpenses.controls.forEach(accommodation => {
            let numberOfNights = accommodation.get('numberOfNights').value || 0;
            let dailyRoomRate = accommodation.get('dailyRoomRate').value || 0;
            let this_total = numberOfNights * dailyRoomRate;
            accommodation.get('totalExpenses').patchValue(this_total.toFixed(2));
            total += this_total;
        });
        this.form.get('accommodationTotal').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
        this.updateSubTotal();
    }

    addMealExpense() {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;
        mealExpenses.push(this.travelExpenseHelper.addMealExpense(this.fb));
    }

    removeMealExpense(index: number) {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;
        mealExpenses.removeAt(index);
        this.updateMealTotals();
    }

    updateMealTotals() {
        let mealExpenses = this.form.get('mealExpenses') as FormArray;

        let total = 0;
        mealExpenses.controls.forEach(meal => {
            let breakfast = meal.get('breakfast').value || 0;
            let lunch = meal.get('lunch').value || 0;
            let dinner = meal.get('dinner').value || 0;
            let this_total = (breakfast * this.lookupData.expenseRates.breakfast) + (lunch * this.lookupData.expenseRates.lunch) + (dinner * this.lookupData.expenseRates.dinner);
            meal.get('total').patchValue((Math.round(this_total * 100 + Number.EPSILON) / 100).toFixed(2));
            total += this_total;
        });
        this.form.get('mealTotal').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
        this.updateSubTotal();
    }

    addOtherExpense() {
        let otherExpenses = this.form.get('otherExpenses') as FormArray;
        otherExpenses.push(this.travelExpenseHelper.addOtherExpense(this.fb));
    }

    removeOtherExpense(index: number) {
        let otherExpenses = this.form.get('otherExpenses') as FormArray;
        otherExpenses.removeAt(index);
        this.updateOtherTotal();
    }

    updateOtherTotal() {
        let otherExpenses = this.form.get('otherExpenses') as FormArray;

        let total = 0;
        otherExpenses.controls.forEach(expense => {
            let amount = expense.get('amount').value || 0;
            total += parseFloat(amount);
        });
        this.form.get('otherTotal').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
        this.updateSubTotal();
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
            this.updateSubTotal();
        }
    }

    addChild() {
        let children = this.form.get('children') as FormArray;
        children.push(this.travelExpenseHelper.addChild(this.fb));
    }

    removeChild(index: number) {
        let children = this.form.get('children') as FormArray;
        children.removeAt(index);
        this.updateSubTotal();
    }

    updateSubTotal() {
        let transportationTotal = parseFloat(this.form.get('transportationTotal').value);
        let accommodationTotal = parseFloat(this.form.get('accommodationTotal').value);;
        let mealTotal = parseFloat(this.form.get('mealTotal').value);
        let otherTotal = parseFloat(this.form.get('otherTotal').value);

        let children = this.form.get('children') as FormArray;
        let childTotal = 0;
        children.controls.forEach(child => {
            let amount = child.get('amountPaid').value || 0;
            childTotal += parseFloat(amount);
        });

        let subTotal = transportationTotal + mealTotal + otherTotal + accommodationTotal + childTotal;

        this.form.get('subTotal').patchValue((Math.round(subTotal * 100 + Number.EPSILON) / 100).toFixed(2));
    }
}