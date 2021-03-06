import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import * as _ from 'lodash';
import { ReimbursementService } from "../../../services/reimbursement.service";

@Component({
    selector: 'app-vtf-case-information',
    templateUrl: './vtf-case-information.component.html',
    styleUrls: ['./vtf-case-information.component.scss'],
})
export class VTFCaseInformationComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    @Input() isDisabled: boolean = false;
    @Input() formType: ApplicationType;
    public form: FormGroup;

    isValid: boolean = false;
    didCheck: boolean = false;

    constructor(private controlContainer: ControlContainer,
        private reimbursementService: ReimbursementService,
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);

        this.isValid = this.form.get('isValid').value;
        this.didCheck = this.form.get('didCheck').value;
        console.log("vtf case info component");
        console.log(this.form);
    }

    caseInfoChange() {
        let info = {
            caseNumber: this.form.get('vtfCaseNumber').value,
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            birthDate: this.form.get('birthDate').value,
        }

        if (info && info.caseNumber && info.birthDate && info.firstName && info.lastName) {
            //validate
            this.reimbursementService.checkCase(info).subscribe((res) => {
                console.log(res);
                this.didCheck = true;
                this.form.get('didCheck').patchValue(this.didCheck);
                this.isValid = res.IsSuccess;
                if (res.IsSuccess) {
                    this.form.get('isValid').patchValue(this.isValid);
                    this.form.get('incidentid').patchValue(res.CaseId.incidentid);
                }
                else {
                    this.form.get('isValid').patchValue(this.isValid);
                    this.form.get('incidentid').patchValue('');
                }
            }, (err) => {
                console.log(err);
            });
        }
        else {
            //haven't filled in all fields
        }
    }
}