import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { iLookupData } from "../../../models/lookup-data.model";
import { LookupService } from "../../../services/lookup.service";
import { MY_FORMATS } from "../../enums-list";
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

  todaysDate = new Date(); // for the birthdate validation
  oldestHuman = new Date(this.todaysDate.getFullYear() - 120, this.todaysDate.getMonth(), this.todaysDate.getDay());

  courtList: string[] = [];

  caseInfoHelper = new CaseInfoInfoHelper();

  constructor(private controlContainer: ControlContainer,
    private lookupService: LookupService,
    private fb: FormBuilder,) {
    super();
  }
  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
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

  addAdditionalAccused() {
    let additionalAccused = this.form.get('additionalAccused') as FormArray;
    additionalAccused.push(this.caseInfoHelper.createAdditionalAccused(this.fb));
  }

  removeAdditionalAccused(index: number) {
    let additionalAccused = this.form.get('additionalAccused') as FormArray;
    additionalAccused.removeAt(index);
  }
}