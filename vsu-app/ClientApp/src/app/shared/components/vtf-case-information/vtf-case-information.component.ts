import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import * as _ from 'lodash';
import { CaseService } from "../../../services/case.service";
import { ContactService } from "../../../services/contact.service";

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

    constructor(private controlContainer: ControlContainer,
        private caseService: CaseService,
        private contactService: ContactService,
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("vtf case info component");
        console.log(this.form);
    }

    caseNumberChange() {
        let caseNumber = this.form.get('vtfCaseNumber').value;
        console.log(caseNumber);
        if (caseNumber) {
            this.getContactIdFromCase(caseNumber);
        }
        else {

        }
    }

    getContactIdFromCase(caseNumber) {
        this.caseService.getCaseByCaseNumber(caseNumber).subscribe((caseRes: any) => {
            console.log("case res");
            console.log(caseRes);
            if (caseRes.value && caseRes.value.length > 0) {
                let contactId = caseRes.value[0]._customerid_value;
                console.log(contactId);
                if (contactId) {
                    this.getContact(contactId);
                }
            }
            else {
                this.clearVTFApplicant(this.form.parent);
            }
        }, (err) => {
            console.log(err);
        });
    }

    getContact(contactId) {
        this.contactService.getContact(contactId).subscribe((contactRes: any) => {
            console.log("contact res");
            console.log(contactRes);
            if (contactRes) {
                this.setVTFApplicant(contactRes, this.form.parent);
            }
            else {
                this.clearVTFApplicant(this.form.parent);
            }
        }, (err) => {
            console.log(err);
        });
    }
}