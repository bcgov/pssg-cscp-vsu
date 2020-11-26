import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData, iOffence } from "../../interfaces/lookup-data.interface";
import { LookupService } from "../../../services/lookup.service";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { CaseInfoInfoHelper } from "./case-information.helper";

@Component({
  selector: 'app-case-information',
  templateUrl: './case-information.component.html',
  styleUrls: ['./case-information.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CaseInformationComponent extends FormBase implements OnInit {
  @Input() formType: ApplicationType;
  @Input() lookupData: iLookupData;
  @Input() isDisabled: boolean;
  public form: FormGroup;

  courtList: string[] = [];
  offenceList: iOffence[] = [];
  scheduleOffences: string[] = ["80", "81", "151", "152", "153", "155", "220", "221", "229", "236", "239", "244 (1)", "264", "266", "267", "268", "269", "269.1", "271", "272", "273", "279 and 279.1", "320.14 (2)", "320.14 (3)",];

  caseInfoHelper = new CaseInfoInfoHelper();
  ApplicationType = ApplicationType;

  constructor(private controlContainer: ControlContainer,
    private lookupService: LookupService,
    private fb: FormBuilder,) {
    super();
  }
  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
    setTimeout(() => { this.form.markAsTouched(); }, 0);
    console.log("case info component");
    console.log(this.form);
    console.log(this.isDisabled);

    if (this.lookupData.courts && this.lookupData.courts.length > 0) {
      this.courtList = this.lookupData.courts.map(c => c.vsd_name);
    }
    else {
      this.lookupService.getCourts().subscribe((res) => {
        this.lookupData.courts = res.value;
        if (this.lookupData.courts) {
          this.lookupData.courts.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
        }
        this.courtList = this.lookupData.courts.map(c => c.vsd_name);
      });
    }

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
    let source = this.form.parent.get('caseInformation.offences') as FormArray;
    let target = this.form.get('offences') as FormArray;

    while (target.controls.length > 0) {
      target.removeAt(0);
    }
    source.controls.forEach(offence => {
      target.push(offence);
    });
  }

  addAdditionalCourtInfo() {
    let courtInfo = this.form.get('courtInfo') as FormArray;
    // let previousCourt = courtInfo.controls[courtInfo.controls.length - 1];
    // let location = previousCourt.get('courtLocation').value;
    courtInfo.push(this.caseInfoHelper.createCourtInfo(this.fb));
  }

  removeAdditionalCourtInfo(index: number) {
    let courtInfo = this.form.get('courtInfo') as FormArray;
    courtInfo.removeAt(index);
  }

  addAdditionalAccused() {
    let additionalAccused = this.form.get('additionalAccused') as FormArray;
    additionalAccused.push(this.caseInfoHelper.createAdditionalAccused(this.fb));
  }

  removeAdditionalAccused(index: number) {
    let additionalAccused = this.form.get('additionalAccused') as FormArray;
    additionalAccused.removeAt(index);
  }
}