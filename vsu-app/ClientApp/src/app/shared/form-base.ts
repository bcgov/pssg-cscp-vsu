import { ValidatorFn, AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import * as _moment from 'moment';

export class FormBase {
    form: FormGroup;

    isFieldValid(field: string, disabled: boolean = false) {
        if (disabled === true) return true;
        let formField = this.form.get(field);
        if (!formField || formField.value === null)
            return true;

        return this.form.get(field).valid || !this.form.get(field).touched;
    }

    isMyControlValid(control: AbstractControl) {
        return control.valid || !control.touched;
    }

    isArrayFieldValid(formArrayName: string, arrayControl: string, arrayIndex: number) {
        let formArray = <FormArray>this.form.get(formArrayName);
        let indexedControl = formArray.controls[arrayIndex];
        let formField = indexedControl.get(arrayControl);
        if (formField == null)
            return true;

        return formField.valid || !formField.touched;
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

    // Requires you to use the [InnerHTML] property on an element rather than {{ }} interpolation
    public checkmarkOrEmpty(controlName: string): string {
        var control = this.form.get(controlName);

        if (control.value === true)
            return '<i class="fa fa-check"> </i>';
        return '--';
    }

    public valueOrEmpty(controlName: any, emptyValue = '--'): string {
        let control = null;

        if (typeof (controlName) == 'string')
            control = this.form.get(controlName);

        if (controlName instanceof FormGroup)
            control = controlName;

        if (controlName instanceof FormControl)
            control = controlName;

        if (control == null || control === undefined)
            return emptyValue;

        if (control.value == null || control.value === undefined)
            return emptyValue;

        var value = control.value;

        if (typeof (value) == 'string' && value.length == 0)
            return emptyValue;

        if (typeof (value) == 'number' && value == 0) {
            return emptyValue;
        }

        if (typeof (value) == 'boolean') {
            return value ? 'Yes' : 'No';
        }

        return control.value;
    }

    public valueForEnum(controlName: any): number {
        let control = null;

        if (typeof (controlName) == 'string')
            control = this.form.get(controlName);

        if (controlName instanceof FormGroup)
            control = controlName;

        if (controlName instanceof FormControl)
            control = controlName;

        if (control == null || control === undefined || control.value == null || control.value === undefined)
            return 0;

        var value = control.value;
        if (typeof (value) == 'string') {
            if (!isNaN(parseFloat(value)) && isFinite(+value)) {
                return parseInt(value);
            }
            else {
                return 0
            }
        }

        if (typeof (value) !== 'number') {
            return 0;
        }

        return control.value;
    }

    public displayMailingAddress(addressControl: any): string {
        let control = null;

        if (typeof (addressControl) == 'string')
            control = this.form.get(addressControl);

        if (addressControl instanceof FormGroup)
            control = addressControl;

        if (control == null || control === undefined)
            return "--";

        let line1 = control.get('line1').value || '';
        let line2 = control.get('line2').value || '';
        let city = control.get('city').value || '';
        let postalCode = control.get('postalCode').value || '';
        let province = control.get('province').value || '';
        let country = control.get('country').value || '';

        let address = line1 + '<br />';
        if (line2 != '')
            address += line2 + '<br />';
        if (city != '')
            address += city + '<br />';
        if (province != '')
            address += province + '<br />';
        if (country != '')
            address += country + '<br />';
        if (postalCode != '')
            address += postalCode;

        return address;
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
}