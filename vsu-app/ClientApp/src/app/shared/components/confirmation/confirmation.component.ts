import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
    @Input() formType: string;
    public form: FormGroup;

    confirmationNumber: string = "test";

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
    }

}
