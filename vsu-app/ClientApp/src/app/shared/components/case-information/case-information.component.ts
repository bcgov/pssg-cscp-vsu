import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../../models/lookup-data.model";
import { LookupService } from "../../../services/lookup.service";
import { EnumHelper, MY_FORMATS } from "../../enums-list";
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
  @Input() lookupData: iLookupData;
  public form: FormGroup;

  courtList: string[] = [];

  EnumHelper = new EnumHelper();
  caseInfoHelper = new CaseInfoInfoHelper();

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

    if (this.lookupData.courts && this.lookupData.courts.length > 0) {
      this.courtList = this.lookupData.courts.map(c => c.vsd_name);
    }
    else {
      this.lookupService.getCourts().subscribe((res) => {
        this.lookupData.courts = res.value;
        if (this.lookupData.courts) {
          this.lookupData.courts.sort(function (a, b) {
            return a.vsd_name.localeCompare(b.vsd_name);
          });
        }
        this.courtList = this.lookupData.courts.map(c => c.vsd_name);
      });
    }
  }

  addAdditionalCourtInfo() {
    let courtInfo = this.form.get('courtInfo') as FormArray;
    let previousCourt = courtInfo.controls[courtInfo.controls.length - 1];
    let location = previousCourt.get('courtLocation').value;
    courtInfo.push(this.caseInfoHelper.createCourtInfo(this.fb, location));
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

  showOtherGender(show: boolean) {
    // let genderOther = this.form.get('genderOther');
    // if (show) {
    //   this.setControlValidators(genderOther, [Validators.required]);
    // }
    // else {
    //   this.clearControlValidators(genderOther);
    //   genderOther.patchValue('');
    // }
  }
}