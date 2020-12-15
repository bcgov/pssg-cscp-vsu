import { ValidatorFn, AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material';
import * as moment from 'moment';

export class FormBase {
    form: FormGroup;
    today = new Date();
    oldestHuman = new Date(this.today.getFullYear() - 120, this.today.getMonth(), this.today.getDay());
    showValidationMessage: boolean = false;
    public currentFormStep: number = 0;
    max_selected_index: number = 0;

    isFieldValid(field: string, disabled: boolean = false) {
        if (disabled === true) return true;
        let formField = this.form.get(field);
        if (!formField || formField.value === null)
            return true;

        return this.form.get(field).valid || !this.form.get(field).touched;
    }

    isMyControlValid(control: AbstractControl) {
        return control.valid || !control.touched || control.disabled;
    }

    validateAllFormFields(formGroup: any) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control.valid === false) {
                console.log("invalid: ", field);
            }

            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            } else if (control instanceof FormArray) {
                for (const control1 of control.controls) {
                    if (control1 instanceof FormControl) {
                        control1.markAsTouched({
                            onlySelf: true
                        });
                    }
                    if (control1 instanceof FormGroup) {
                        this.validateAllFormFields(control1);
                    }
                }
            }
        });
    }

    validateDate(control: AbstractControl) {
        let date = moment(new Date(control.value));
        if (date.isAfter(moment(this.today))) {
            control.setErrors({ 'incorrect': true });
        }
        else if (date.isBefore(moment(this.oldestHuman))) {
            control.setErrors({ 'incorrect': true });
        }
        else {
            control.setErrors(null);
        }
    }

    getErrors(formGroup: any, errors: any = {}) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                errors[field] = control.errors;
            } else if (control instanceof FormGroup) {
                errors[field] = this.getErrors(control);
            } else if (control instanceof FormArray) {
                errors[field] = this.getErrors(control);
            }
        });
        return errors;
    }

    public hasValueSet(controlName: string): boolean {
        var control = this.form.get(controlName);

        if (control == null || control === undefined)
            return false;

        if (control.value == null || control.value === undefined)
            return false;

        if (control.value.length == 0 || control.value.length === undefined)
            return false;

        return control.value.length > 0;
    }

    setControlValidators(control: AbstractControl | FormControl, newValidator: ValidatorFn | ValidatorFn[]) {
        control.setValidators(newValidator);
        control.updateValueAndValidity();
    }

    clearControlValidators(control: AbstractControl | FormControl) {
        control.clearValidators();
        control.setErrors(null);
        control.updateValueAndValidity();
    }

    gotoPage(selectPage: MatStepper): void {
        console.log("goto page");
        window.scroll(0, 0);
        this.showValidationMessage = false;
        this.currentFormStep = selectPage.selectedIndex;
        if (this.currentFormStep > this.max_selected_index) this.max_selected_index = this.currentFormStep;
    }
}