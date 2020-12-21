import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";
import * as _ from 'lodash';

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
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("vtf case info component");
        console.log(this.form);
    }
}