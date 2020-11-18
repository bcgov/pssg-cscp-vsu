import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
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

    applicantTypeChange() {
        let type = this.form.get('applicantType').value;
        let otherControl = this.form.get("applicantTypeOther");
        let otherRequired = type === this.enum.ApplicantType.Other_Family_Member.val;

        if (otherRequired) {
            this.showOtherApplicantType = true;
            this.setControlValidators(otherControl, [Validators.required]);
        }
        else {
            otherControl.patchValue('');
            this.showOtherApplicantType = false;
            this.clearControlValidators(otherControl);
        }

        if (this.formType === ApplicationType.TRAVEL_FUNDS) {
            if (type !== this.enum.ApplicantType.Support_Person.val) {
                this.form.get("victimAlreadySubmitted").patchValue('');
                this.form.get("victimAlreadySubmittedComment").patchValue('');
            }

            if (type !== this.enum.ApplicantType.Immediate_Family_Member.val) {
                this.form.get("otherFamilyAlsoApplying").patchValue('');
                this.form.get("otherFamilyAlsoApplyingComment").patchValue('');
            }
        }
    }

    victimAlreadySubmittedChange() {
        if (this.form.get("victimAlreadySubmitted").value !== this.enum.MultiBoolean.Undecided.val) {
            this.form.get("victimAlreadySubmittedComment").patchValue('');
        }
    }

    otherFamilyAlsoApplyingChange() {
        if (this.form.get("otherFamilyAlsoApplying").value !== this.enum.MultiBoolean.Undecided.val) {
            this.form.get("otherFamilyAlsoApplyingComment").patchValue('');
        }
    }

    checkAtLeastOneContactMethod() {
        let isValid = false;
        let contactMethods = this.form.get('contactMethods') as FormArray;
        for (let i = 0; i < contactMethods.controls.length; ++i) {
            let thisMethod = contactMethods.controls[i];
            if (thisMethod.get('val').value && thisMethod.get('val').valid && thisMethod.get('leaveMessage').value == this.enum.Boolean.True.val) {
                isValid = true;
            }
        }

        let val = isValid ? 'valid' : '';
        this.form.get('atLeastOneContactMethod').patchValue(val);
    }
}