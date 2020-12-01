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
    scheduleOffences: string[] = ["80", "81", "151", "152", "153", "155", "220", "221", "229", "236", "239", "244 (1)", "264", "266", "267", "268", "269", "269.1", "271", "272", "273", "279 and 279.1", "320.14 (2)", "320.14 (3)",];

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
            this.offenceList = this.offenceList.filter(o => this.scheduleOffences.indexOf(o.vsd_criminalcode) >= 0);
            this.populateOffences();
        }
        else {
            this.lookupService.getOffences().subscribe((res) => {
                this.lookupData.offences = res.value;
                if (this.lookupData.offences) {
                    this.lookupData.offences.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                }
                this.offenceList = this.lookupData.offences;
                this.offenceList = this.offenceList.filter(o => this.scheduleOffences.indexOf(o.vsd_criminalcode) >= 0);
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