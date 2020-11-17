import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { ApplicationType, EnumHelper, MY_FORMATS } from "../../enums-list";
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
    @Input() formType: ApplicationType;
    @Input() isDisabled: boolean;
    public form: FormGroup;

    showOtherApplicantType: boolean = false;
    today: Date = new Date();

    EnumHelper = new EnumHelper();
    applicantInfoHelper = new ApplicantInfoHelper();

    ApplicationType = ApplicationType;

    constructor(private controlContainer: ControlContainer) {
        super();
    }
    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
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
            control.patchValue('');
            this.showOtherApplicantType = false;
            this.clearControlValidators(control);
        }
    }

    checkAtLeastOneContactMethod() {
        let isValid = false;
        let contactMethods = this.form.get('contactMethods') as FormArray;
        for (let i = 0; i < contactMethods.controls.length; ++i) {
            let thisMethod = contactMethods.controls[i];
            if (thisMethod.get('val').value && thisMethod.get('val').valid && thisMethod.get('leaveMessage').value == this.EnumHelper.Boolean.True.val) {
                isValid = true;
            }
        }

        let val = isValid ? 'valid' : '';
        this.form.get('atLeastOneContactMethod').patchValue(val);
    }
}