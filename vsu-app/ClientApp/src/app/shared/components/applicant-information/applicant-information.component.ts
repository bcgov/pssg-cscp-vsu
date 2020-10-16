import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../../models/lookup-data.model";
import { EnumHelper, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { ApplicantInfoHelper } from "./applicant-information.helper";

@Component({
    selector: 'app-applicant-information',
    templateUrl: './applicant-information.component.html',
    styleUrls: ['./applicant-information.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ApplicantInformationComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    public form: FormGroup;

    showOtherApplicantType: boolean = false;

    EnumHelper = new EnumHelper();
    applicantInfoHelper = new ApplicantInfoHelper();

    constructor(private controlContainer: ControlContainer) {
        super();
    }
    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        console.log("applicant info component");
        console.log(this.form);

        this.checkAtLeastOneContactMethod();
    }

    showOtherGender(show: boolean) {
        let genderOther = this.form.get('genderOther');
        if (show) {
            this.setControlValidators(genderOther, [Validators.required]);
        }
        else {
            this.clearControlValidators(genderOther);
            genderOther.patchValue('');
        }
    }

    setApplicantTypeOtherRequired(required) {
        let control = this.form.get("applicantTypeOther");
        if (required) {
            this.showOtherApplicantType = true;
            this.setControlValidators(control, [Validators.required]);
        }
        else {
            this.showOtherApplicantType = false;
            this.clearControlValidators(control);
        }
    }

    contactMethodChange(item: FormGroup) {
        let type = item.get('type').value;
        let current_validators = [];
        switch (type) {
            case 'telephone': {
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                break;
            }
            case 'mobile': {
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                break;
            }
            case 'email': {
                current_validators = [Validators.email];
                break;
            }
            default: {
                break;
            }
        }

        this.setControlValidators(item.get('val'), current_validators);
        item.get('val').patchValue('');
    }

    checkAtLeastOneContactMethod() {
        let isValid = false;
        let contactMethods = this.form.get('contactMethods') as FormArray;
        for (let i = 0; i < contactMethods.controls.length; ++i) {
            let thisMethod = contactMethods.controls[i];
            if (thisMethod.get('val').value && thisMethod.get('val').valid) {
                isValid = true;
            }
        }

        let val = isValid ? 'valid' : '';

        this.form.get('atLeastOneContactMethod').patchValue(val);
    }
}