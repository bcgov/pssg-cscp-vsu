import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData } from "../../interfaces/lookup-data.interface";

@Component({
    selector: 'app-designate',
    templateUrl: './designate.component.html',
})
export class DesignateComponent extends FormBase implements OnInit {
    @Input() isDisabled: boolean;
    @Input() formType: ApplicationType;
    @Input() lookupData: iLookupData;
    public form: FormGroup;

    constructor(private controlContainer: ControlContainer) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
    }
}