import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { VTFReimbursementApplicantInfoHelper } from "./vtf-reimbursement-applicant-information.helper";

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

    today: Date = new Date();

    applicantInfoHelper = new VTFReimbursementApplicantInfoHelper();

    ApplicationType = ApplicationType;

    constructor(private controlContainer: ControlContainer,
    ) {
        super();
    }
    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("vtf reimbursement applicant info component");
        console.log(this.form);
    }
}