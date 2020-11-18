import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
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

    constructor(private controlContainer: ControlContainer) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
    }


}