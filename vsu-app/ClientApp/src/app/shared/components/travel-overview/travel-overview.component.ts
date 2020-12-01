import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { LookupService } from "../../../services/lookup.service";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { iLookupData, iOffence } from "../../interfaces/lookup-data.interface";
import * as _ from 'lodash';

@Component({
    selector: 'app-travel-overview',
    templateUrl: './travel-overview.component.html',
    styleUrls: ['./travel-overview.component.scss'],
})
export class TravelOverviewComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    @Input() isDisabled: boolean = false;
    @Input() formType: ApplicationType;
    public form: FormGroup;

    offenceList: iOffence[] = [];

    constructor(private controlContainer: ControlContainer,
        private lookupService: LookupService,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("overview component");
        console.log(this.form);

        if (this.lookupData.offences && this.lookupData.offences.length > 0) {
            this.offenceList = this.lookupData.offences;
            this.populateOffences();
        }
        else {
            this.lookupService.getOffences().subscribe((res) => {
                this.lookupData.offences = res.value;
                if (this.lookupData.offences) {
                    this.lookupData.offences.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                }
                this.offenceList = this.lookupData.offences;
                this.populateOffences();
            });
        }
    }

    populateOffences() {
        let offences = this.form.get('offences') as FormArray;
        if (offences.length > 0) return;
        this.offenceList.forEach(offence => {
            offences.push(this.createOffence(this.fb, offence));
        });
    }

    createOffence(fb: FormBuilder, offence: iOffence) {
        return fb.group({
            id: [offence.vsd_offenseid],
            name: [offence.vsd_name],
            criminal_code: [offence.vsd_criminalcode],
            checked: [false]
        });
    }

    selectedOffenceChange() {
        let source = this.form.get('offences') as FormArray;
        let target = this.form.parent.get('caseInformation.offences') as FormArray;

        while (target.controls.length > 0) {
            target.removeAt(0);
        }
        source.controls.forEach(offence => {
            target.push(offence);
        });
    }
}