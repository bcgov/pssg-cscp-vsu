import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { VTFReimbursementApplicantInfoHelper } from "./vtf-reimbursement-applicant-information.helper";
import * as moment from 'moment';
import { TIME } from "../../regex.constants";

@Component({
    selector: 'app-vtf-reimbursement-applicant-information',
    templateUrl: './vtf-reimbursement-applicant-information.component.html',
    styleUrls: ['./vtf-reimbursement-applicant-information.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class VTFReimbursementApplicantInformationComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    @Input() formType: ApplicationType;
    @Input() isDisabled: boolean;
    public form: FormGroup;

    timeRegex = TIME;

    today: Date = new Date();

    applicantInfoHelper = new VTFReimbursementApplicantInfoHelper();

    ApplicationType = ApplicationType;

    showContactInfoComments: boolean = false;
    travelPeriodStartDates: Date[] = [];

    constructor(private controlContainer: ControlContainer,
        private fb: FormBuilder,
    ) {
        super();
    }
    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("vtf reimbursement applicant info component");
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
        travelDates.push(this.applicantInfoHelper.addTravelDate(this.fb));
        this.travelPeriodStartDates.push(null);
    }

    removeTravelDate(index: number) {
        let travelDates = this.form.get('travelDates') as FormArray;
        travelDates.removeAt(index);
        this.travelPeriodStartDates.splice(index, 1);
    }
}