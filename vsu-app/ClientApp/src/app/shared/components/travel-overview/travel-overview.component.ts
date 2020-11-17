import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { FormBase } from "../../form-base";

@Component({
    selector: 'app-travel-overview',
    templateUrl: './travel-overview.component.html',
    styleUrls: ['./travel-overview.component.scss'],
})
export class TravelOverviewComponent extends FormBase implements OnInit {
    @Input() isDisabled: boolean = false;
    @Input() formType: ApplicationType;
    public form: FormGroup;
    EnumHelper = new EnumHelper();

    constructor(private controlContainer: ControlContainer) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("overview component");
        console.log(this.form);
    }
}