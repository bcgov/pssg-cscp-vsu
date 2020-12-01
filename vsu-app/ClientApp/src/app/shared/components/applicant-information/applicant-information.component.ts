import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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

    today: Date = new Date();

    applicantInfoHelper = new ApplicantInfoHelper();

    ApplicationType = ApplicationType;

    constructor(private controlContainer: ControlContainer,
        private fb: FormBuilder,
    ) {
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

        if (this.formType === ApplicationType.NOTIFICATION) {
            let otherControl = this.form.get("applicantTypeOther");
            let otherRequired = type === this.enum.ApplicantType.Other_Family_Member.val;

            if (otherRequired) {
                this.setControlValidators(otherControl, [Validators.required]);
            }
            else {
                otherControl.patchValue('');
                this.clearControlValidators(otherControl);
            }
        }

        if (this.formType === ApplicationType.TRAVEL_FUNDS) {
            let supportPersonRelationshipControl = this.form.get("supportPersonRelationship");
            let IFMRelationshipControl = this.form.get("IFMRelationship");

            if (type === this.enum.ApplicantType.Support_Person.val) {
                this.setControlValidators(supportPersonRelationshipControl, [Validators.required]);
            }
            else {
                supportPersonRelationshipControl.patchValue('');
                this.clearControlValidators(supportPersonRelationshipControl);
                this.form.get("victimAlreadySubmitted").patchValue(null);
                this.form.get("victimAlreadySubmittedComment").patchValue('');
            }

            if (type === this.enum.ApplicantType.Immediate_Family_Member.val) {
                this.setControlValidators(IFMRelationshipControl, [Validators.required]);
            }
            else {
                IFMRelationshipControl.patchValue('');
                this.clearControlValidators(IFMRelationshipControl);
                this.form.get("otherFamilyAlsoApplying").patchValue(null);
                this.form.get("otherFamilyAlsoApplyingComment").patchValue('');
            }

            if (type === this.enum.ApplicantType.Victim_Service_Worker.val) {
                this.addVSW();
            }
            else {
                this.deleteVSW();
                this.form.get("vswComment").patchValue('');
                this.form.get("coveredByVictimServiceProgram").patchValue(null);
                this.form.get("coveredByVictimServiceProgramComment").patchValue('');


            }
        }
    }

    addVSW() {
        let vsw = this.form.get('victimServiceWorker') as FormArray;
        if (vsw.length == 0) {
            vsw.push(this.applicantInfoHelper.createVSW(this.fb));
        }
    }

    deleteVSW() {
        let vsw = this.form.get('victimServiceWorker') as FormArray;
        while (vsw.length > 0) {
            vsw.removeAt(0);
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