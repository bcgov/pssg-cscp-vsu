import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { EnumHelper } from "../../enums-list";
import { FormBase } from "../../form-base";

@Component({
    selector: 'app-contact-method',
    templateUrl: './contact-method.component.html',
})
export class ContactMethodComponent extends FormBase implements OnInit {
    public form: FormGroup;
    @Input() number: number = 1;
    @Input() isDeligate: boolean = false;
    @Input() parent: FormGroup;
    @Input() disabled: boolean;

    EnumHelper = new EnumHelper();
    constructor(private controlContainer: ControlContainer) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
    }


}