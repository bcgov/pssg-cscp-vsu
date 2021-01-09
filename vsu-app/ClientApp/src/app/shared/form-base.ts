import { ValidatorFn, AbstractControl, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import * as moment from 'moment';
import { ApplicationType, EnumHelper } from './enums-list';
import * as _ from 'lodash';
import { IDynamicsContact } from './interfaces/dynamics/contact.interface';

export class FormBase {
    form: FormGroup;
    today = new Date();
    oldestHuman = new Date(this.today.getFullYear() - 120, this.today.getMonth(), this.today.getDay());
    enum = new EnumHelper();
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

    contactMethodChange(item: FormGroup, isRequired: boolean = false) {
        let type = item.get('type').value;
        let current_validators = [];
        if (isRequired) current_validators = [Validators.required];

        if (type == this.enum.ContactType.Telephone.val) {
            if (item.get('previousType').value == this.enum.ContactType.Email.val) {
                item.get('val').patchValue('');
            }
            current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
        }
        else if (type == this.enum.ContactType.Cellular.val) {
            if (item.get('previousType').value == this.enum.ContactType.Email.val) {
                item.get('val').patchValue('');
            }
            current_validators = current_validators.concat([Validators.minLength(10), Validators.maxLength(15)]);
        }
        else if (type == this.enum.ContactType.Email.val) {
            if (item.get('previousType').value == this.enum.ContactType.Telephone.val || item.get('previousType').value == this.enum.ContactType.Cellular.val) {
                item.get('val').patchValue('');
            }
            current_validators = current_validators.concat([Validators.email]);
        }
        else {
            item.get('val').patchValue('');
        }

        item.get('previousType').patchValue(type);
        this.setControlValidators(item.get('val'), current_validators);
    }

    checkAtLeastOneContactMethod(base_form: AbstractControl, isDeligate: boolean = false) {
        let isValid = false;

        if (isDeligate) {
            let designates = base_form.get('designate') as FormArray;
            if (designates.length == 0) return;
            base_form = designates.controls[0];
        }

        let contactMethods = base_form.get('contactMethods') as FormArray;
        for (let i = 0; i < contactMethods.controls.length; ++i) {
            let thisMethod = contactMethods.controls[i];
            //&& thisMethod.get('leaveMessage').value == this.enum.Boolean.True.val
            if (thisMethod.get('val').value && thisMethod.get('val').valid) {
                isValid = true;
            }
        }

        let val = isValid ? 'valid' : '';
        base_form.get('atLeastOneContactMethod').patchValue(val);
    }

    copyApplicantAddressToDeligate(form: FormGroup | FormArray, formType: ApplicationType) {
        if (formType === ApplicationType.NOTIFICATION) {
            let designates = form.get('recipientDetails.designate') as FormArray;
            if (designates.controls.length == 0) return;
            let copyAddress = designates.controls[0].get('addressSameAsApplicant').value === true;
            let target = designates.controls[0].get('address');
            let source = form.get('applicantInformation.address');
            let options = { onlySelf: false, emitEvent: true };

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
                target.get('line1').patchValue('');
                target.get('line2').patchValue('');
                target.get('city').patchValue('');
                target.get('postalCode').patchValue('');
                target.get('province').patchValue('British Columbia');
                target.get('country').patchValue('Canada');

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
    }

    setVictimInfoSameAsApplicant(form: FormGroup | FormArray) {
        let victimInfo = form.get('caseInformation');
        let applicantInfo = form.get('applicantInformation');
        let copy = victimInfo.get('victimInfoSameAsApplicant').value;
        let options = { onlySelf: false, emitEvent: true };
        if (copy) {
            victimInfo.get('firstName').patchValue(applicantInfo.get('firstName').value);
            victimInfo.get('middleName').patchValue(applicantInfo.get('middleName').value);
            victimInfo.get('lastName').patchValue(applicantInfo.get('lastName').value);
            victimInfo.get('birthDate').patchValue(applicantInfo.get('birthDate').value);
            victimInfo.get('gender').patchValue(applicantInfo.get('gender').value);

            victimInfo.get('firstName').setErrors(null, options);
            victimInfo.get('middleName').setErrors(null, options);
            victimInfo.get('lastName').setErrors(null, options);
            victimInfo.get('birthDate').setErrors(null, options);
            victimInfo.get('gender').setErrors(null, options);

            victimInfo.get('firstName').disable(options);
            victimInfo.get('middleName').disable(options);
            victimInfo.get('lastName').disable(options);
            victimInfo.get('birthDate').disable(options);
            victimInfo.get('gender').disable(options);
        }
        else {
            // victimInfo.get('firstName').patchValue('');
            // victimInfo.get('middleName').patchValue('');
            // victimInfo.get('lastName').patchValue('');
            // victimInfo.get('birthDate').patchValue('');
            // victimInfo.get('gender').patchValue('');

            victimInfo.get('firstName').enable(options);
            victimInfo.get('middleName').enable(options);
            victimInfo.get('lastName').enable(options);
            victimInfo.get('birthDate').enable(options);
            victimInfo.get('gender').enable(options);
        }

        victimInfo.get('firstName').updateValueAndValidity(options);
        victimInfo.get('middleName').updateValueAndValidity(options);
        victimInfo.get('lastName').updateValueAndValidity(options);
        victimInfo.get('birthDate').updateValueAndValidity(options);
        victimInfo.get('gender').updateValueAndValidity(options);
    }

    setApplicantInfoSameAsVictim(form: FormGroup | FormArray) {
        let victimInfo = form.get('caseInformation');
        let applicantInfo = form.get('applicantInformation');
        let copy = applicantInfo.get('applicantInfoSameAsVictim').value;
        let options = { onlySelf: false, emitEvent: true };
        if (copy) {
            applicantInfo.get('firstName').patchValue(victimInfo.get('firstName').value);
            applicantInfo.get('middleName').patchValue(victimInfo.get('middleName').value);
            applicantInfo.get('lastName').patchValue(victimInfo.get('lastName').value);
            applicantInfo.get('birthDate').patchValue(victimInfo.get('birthDate').value);
            applicantInfo.get('gender').patchValue(victimInfo.get('gender').value);

            applicantInfo.get('firstName').setErrors(null, options);
            applicantInfo.get('middleName').setErrors(null, options);
            applicantInfo.get('lastName').setErrors(null, options);
            applicantInfo.get('birthDate').setErrors(null, options);
            applicantInfo.get('gender').setErrors(null, options);

            applicantInfo.get('firstName').disable(options);
            applicantInfo.get('middleName').disable(options);
            applicantInfo.get('lastName').disable(options);
            applicantInfo.get('birthDate').disable(options);
            applicantInfo.get('gender').disable(options);
        }
        else {
            // applicantInfo.get('firstName').patchValue('');
            // applicantInfo.get('middleName').patchValue('');
            // applicantInfo.get('lastName').patchValue('');
            // applicantInfo.get('birthDate').patchValue('');
            // applicantInfo.get('gender').patchValue('');

            applicantInfo.get('firstName').enable(options);
            applicantInfo.get('middleName').enable(options);
            applicantInfo.get('lastName').enable(options);
            applicantInfo.get('birthDate').enable(options);
            applicantInfo.get('gender').enable(options);
        }

        applicantInfo.get('firstName').updateValueAndValidity(options);
        applicantInfo.get('middleName').updateValueAndValidity(options);
        applicantInfo.get('lastName').updateValueAndValidity(options);
        applicantInfo.get('birthDate').updateValueAndValidity(options);
        applicantInfo.get('gender').updateValueAndValidity(options);
    }

    checkFormGroupHasValue(form: FormGroup) {
        return Object.values(form.controls).some(({ value }) => !!value);
    }

    setVTFApplicant(contact: IDynamicsContact, form: FormGroup | FormArray) {
        let applicantInfo = form.get('applicantInformation');
        let options = { onlySelf: false, emitEvent: true };

        applicantInfo.get('firstName').patchValue(contact.firstname);
        applicantInfo.get('middleName').patchValue(contact.middlename);
        applicantInfo.get('lastName').patchValue(contact.lastname);

        applicantInfo.get('firstName').setErrors(null, options);
        applicantInfo.get('middleName').setErrors(null, options);
        applicantInfo.get('lastName').setErrors(null, options);

        // applicantInfo.get('firstName').disable(options);
        // applicantInfo.get('middleName').disable(options);
        // applicantInfo.get('lastName').disable(options);

        applicantInfo.get('address.line1').patchValue(contact.address1_line1);
        applicantInfo.get('address.line2').patchValue(contact.address1_line2);
        applicantInfo.get('address.city').patchValue(contact.address1_city);
        applicantInfo.get('address.postalCode').patchValue(contact.address1_postalcode);
        applicantInfo.get('address.province').patchValue(contact.address1_stateorprovince);
        applicantInfo.get('address.country').patchValue(contact.address1_country);

        applicantInfo.get('address.line1').setErrors(null, options);
        applicantInfo.get('address.line2').setErrors(null, options);
        applicantInfo.get('address.city').setErrors(null, options);
        applicantInfo.get('address.postalCode').setErrors(null, options);
        applicantInfo.get('address.province').setErrors(null, options);
        applicantInfo.get('address.country').setErrors(null, options);

        // applicantInfo.get('address.line1').disable(options);
        // applicantInfo.get('address.line2').disable(options);
        // applicantInfo.get('address.city').disable(options);
        // applicantInfo.get('address.postalCode').disable(options);
        // applicantInfo.get('address.province').disable(options);
        // applicantInfo.get('address.country').disable(options);
    }

    clearVTFApplicant(form: FormGroup | FormArray) {
        let applicantInfo = form.get('applicantInformation');
        let options = { onlySelf: false, emitEvent: true };

        applicantInfo.get('firstName').patchValue('');
        applicantInfo.get('middleName').patchValue('');
        applicantInfo.get('lastName').patchValue('');

        // applicantInfo.get('firstName').setErrors(null, options);
        // applicantInfo.get('middleName').setErrors(null, options);
        // applicantInfo.get('lastName').setErrors(null, options);

        applicantInfo.get('address.line1').patchValue('');
        applicantInfo.get('address.line2').patchValue('');
        applicantInfo.get('address.city').patchValue('');
        applicantInfo.get('address.postalCode').patchValue('');
        applicantInfo.get('address.province').patchValue('');
        applicantInfo.get('address.country').patchValue('');

        // applicantInfo.get('address.line1').setErrors(null, options);
        // applicantInfo.get('address.line2').setErrors(null, options);
        // applicantInfo.get('address.city').setErrors(null, options);
        // applicantInfo.get('address.postalCode').setErrors(null, options);
        // applicantInfo.get('address.province').setErrors(null, options);
        // applicantInfo.get('address.country').setErrors(null, options);

        applicantInfo.markAsPristine();
        applicantInfo.updateValueAndValidity();
    }

    gotoPage(selectPage: MatStepper): void {
        console.log("goto page");
        window.scroll(0, 0);
        this.showValidationMessage = false;
        this.currentFormStep = selectPage.selectedIndex;
        if (this.currentFormStep > this.max_selected_index) this.max_selected_index = this.currentFormStep;
    }

    gotoNextStep(stepper: MatStepper, emptyPage?: boolean): void {
        if (stepper) {
            const desiredFormIndex: number = stepper.selectedIndex;
            const step_header = stepper._stepHeader.find(step => step.index == desiredFormIndex);
            const step_label = step_header ? step_header.label : "";
            const this_step = stepper._steps.find(step => step.label == step_label);
            if (this_step) {
                const formGroupName = this_step.stepControl.get("name").value;
                console.log(`Form for validation is ${formGroupName}.`);
                const formParts = this.form.get(formGroupName);
                console.log(this.form);

                let formValid = true;

                if (formParts != null) {
                    formValid = formParts.valid;
                    console.log(_.cloneDeep(formParts));
                } else {
                    alert('That was a null form. Nothing to validate');
                }

                if (emptyPage != null) {
                    if (emptyPage == true) {
                        formValid = true;
                    }
                }

                if (formValid) {
                    console.log('Form is valid so proceeding to next step.');
                    this.showValidationMessage = false;
                    window.scroll(0, 0);
                    stepper.next();
                } else {
                    console.log('Form is not valid rerun the validation and show the validation message.');
                    this.validateAllFormFields(formParts);
                    this.showValidationMessage = true;
                }
            }
        }
    }

    gotoPreviousStep(stepper: MatStepper): void {
        if (stepper) {
            console.log('Going back a step');
            this.showValidationMessage = false;
            window.scroll(0, 0);
            stepper.previous();
        }
    }
}