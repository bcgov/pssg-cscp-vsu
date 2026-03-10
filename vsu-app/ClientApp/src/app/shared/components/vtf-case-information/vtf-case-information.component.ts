import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ReimbursementService } from '../../../../api/reimbursement/reimbursement.service';
import { ApplicationType } from '../../enums-list';
import { FormBase } from '../../form-base';
import { iLookupData } from '../../interfaces/lookup-data.interface';

@Component({
  standalone: false,
  selector: 'app-vtf-case-information',
  templateUrl: './vtf-case-information.component.html',
  styleUrls: ['./vtf-case-information.component.scss']
})
export class VTFCaseInformationComponent extends FormBase implements OnInit {
  @Input() lookupData: iLookupData;
  @Input() isDisabled: boolean = false;
  @Input() formType: ApplicationType;
  declare public form: FormGroup;

  isValid: boolean = false;
  didCheck: boolean = false;

  constructor(
    private controlContainer: ControlContainer,
    private reimbursementService: ReimbursementService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
    setTimeout(() => {
      this.form.markAsTouched();
    }, 0);

    this.isValid = this.form.get('isValid').value;
    this.didCheck = this.form.get('didCheck').value;
  }

  caseInfoChange() {
    let info = {
      caseNumber: this.form.get('vtfCaseNumber').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      birthDate: this.form.get('birthDate').value
    };

    if (info && info.caseNumber && info.birthDate && info.firstName && info.lastName) {
      //validate
      this.reimbursementService.postApiReimbursementCheckCase<any>(info).subscribe({
          next: (res) => {
            this.didCheck = true;
            this.form.get('didCheck').patchValue(this.didCheck);
            this.isValid = res.Results?.IsSuccess || res.isSuccess;
            if (this.isValid) {
              this.form.get('isValid').patchValue(this.isValid);
              const caseId = res.Results?.CaseId?.Id || res.caseId;
              this.form.get('incidentId').patchValue(caseId);
            } else {
              this.form.get('isValid').patchValue(this.isValid);
              this.form.get('incidentId').patchValue('');
            }
          },
          error: (err) => {
            console.log(err);
          }
        }
      );
    } else {
      //haven't filled in all fields
    }
  }
}
