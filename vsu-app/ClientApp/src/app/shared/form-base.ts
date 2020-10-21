import { ValidatorFn, AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import * as moment from 'moment';

export class FormBase {
    form: FormGroup;
    today = new Date();
    oldestHuman = new Date(this.today.getFullYear() - 120, this.today.getMonth(), this.today.getDay());

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

    public hasSignature(controlName: string): boolean {
        return this.hasValueSet(controlName);
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

    copyApplicantAddressToDeligate(form: FormGroup | FormArray) {
        let designates = form.get('recipientDetails.designate') as FormArray;
        if (designates.length == 0) return;
        let copyAddress = designates.controls[0].get('addressSameAsApplicant').value === true;
        let target = designates.controls[0].get('address');
        let source = form.get('applicantInformation.address');
        let options = { onlySelf: true, emitEvent: true };

        if (copyAddress) {
            target.get('line1').patchValue(source.get('line1').value, options);
            target.get('line2').patchValue(source.get('line2').value, options);
            target.get('city').patchValue(source.get('city').value, options);
            target.get('postalCode').patchValue(source.get('postalCode').value, options);
            target.get('province').patchValue(source.get('province').value, options);
            target.get('country').patchValue(source.get('country').value, options);

            target.get('line1').setErrors(null, options);
            target.get('line2').setErrors(null, options);
            target.get('city').setErrors(null, options);
            target.get('postalCode').setErrors(null, options);
            target.get('province').setErrors(null, options);
            target.get('country').setErrors(null, options);

            target.get('line1').disable(options);
            target.get('line2').disable(options);
            target.get('city').disable(options);
            target.get('postalCode').disable(options);
            target.get('province').disable(options);
            target.get('country').disable(options);
        }
        else {
            target.get('line1').enable(options);
            target.get('line2').enable(options);
            target.get('city').enable(options);
            target.get('postalCode').enable(options);
            target.get('province').enable(options);
            target.get('country').enable(options);
        }

        target.get('line1').updateValueAndValidity(options);
        target.get('line2').updateValueAndValidity(options);
        target.get('city').updateValueAndValidity(options);
        target.get('postalCode').updateValueAndValidity(options);
        target.get('province').updateValueAndValidity(options);
        target.get('country').updateValueAndValidity(options);
    }

    setApplicantInfoSameAsVictim(form: FormGroup | FormArray) {
        let victimInfo = form.get('caseInformation');
        let applicantInfo = form.get('applicantInformation');
        let copy = applicantInfo.get('applicantInfoSameAsVictim').value;
        let options = { onlySelf: true, emitEvent: true };
        if (copy) {
            applicantInfo.get('firstName').patchValue(victimInfo.get('firstName').value);
            applicantInfo.get('middleName').patchValue(victimInfo.get('middleName').value);
            applicantInfo.get('lastName').patchValue(victimInfo.get('lastName').value);

            applicantInfo.get('firstName').setErrors(null, options);
            applicantInfo.get('middleName').setErrors(null, options);
            applicantInfo.get('lastName').setErrors(null, options);

            applicantInfo.get('firstName').disable(options);
            applicantInfo.get('middleName').disable(options);
            applicantInfo.get('lastName').disable(options);
        }
        else {
            applicantInfo.get('firstName').enable(options);
            applicantInfo.get('middleName').enable(options);
            applicantInfo.get('lastName').enable(options);
        }

        applicantInfo.get('firstName').updateValueAndValidity(options);
        applicantInfo.get('middleName').updateValueAndValidity(options);
        applicantInfo.get('lastName').updateValueAndValidity(options);
    }
}