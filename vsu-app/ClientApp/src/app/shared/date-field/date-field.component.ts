import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnInit, OnDestroy {
    @Input() control: AbstractControl;
    @Input() disabled: boolean;
    @Input() max: Date;
    @Input() min: Date;
    dayList = [];
    yearList = [];

    day = 0;
    month = -1;
    year = 0;

    currentYear = new Date().getFullYear();
    options = { onlySelf: true, emitEvent: false };

    controlSub: Subscription;

    constructor() { }

    ngOnInit() {
        let date: moment.Moment = this.control.value;
        if (date) {
            this.year = date.year();
            this.month = date.month();
            this.day = date.date();
        }

        for (let i = 1; i <= 31; ++i) {
            this.dayList.push(i);
        }

        for (let i = 0; i < 120; ++i) {
            this.yearList.push(this.currentYear - i);
        }

        this.controlSub = this.control.valueChanges.subscribe((val) => {
            let updated_date: moment.Moment = val;
            if (updated_date) {
                this.year = updated_date.year();
                this.month = updated_date.month();
                this.day = updated_date.date();
            }
            else if (val === "") {
                this.year = 0;
                this.month = -1;
                this.day = 0;
            }
        });
    }

    ngOnDestroy() {
        if (this.controlSub) this.controlSub.unsubscribe();
    }

    pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    output() {
        if (this.day == 0 || this.month == -1 || this.year == 0) {
            this.control.patchValue('', this.options);
            return;
        }

        this.control.markAsTouched();

        let hasMinError = false;
        let hasMaxError = false;

        let date = moment(new Date(this.year, this.month, this.day));
        if (this.min) {
            if (date.isBefore(moment(this.min))) {
                hasMinError = true;
                setTimeout(() => { this.control.setErrors({ 'incorrect': true }); }, 0);
            }
        }

        if (this.max) {
            if (date.isAfter(moment(this.max))) {
                hasMaxError = true;
                setTimeout(() => { this.control.setErrors({ 'incorrect': true }); }, 0);
            }
        }

        if (!hasMinError && !hasMaxError) {
            setTimeout(() => { this.control.setErrors(null); }, 0);
        }

        this.control.patchValue(date, this.options);
    }

}
