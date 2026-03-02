import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { LookupService } from '../services/lookup.service';
import { NotificationQueueService } from '../services/notification-queue.service';
import { ApplicantInfoHelper } from '../shared/components/applicant-information/applicant-information.helper';
import { AuthInfoHelper } from '../shared/components/authorization/authorization.helper';
import { CaseInfoInfoHelper } from '../shared/components/case-information/case-information.helper';
import { RecipientDetailsHelper } from '../shared/components/recipient-details/recipient-details.helper';
import { FORM_TITLES, FORM_TYPES } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import {
  iApplicantInformation,
  iAuthorizationInformation,
  iCaseInformation,
  iNotificationApplication,
  iRecipientDetails
} from '../shared/interfaces/application.interface';
import { convertNotificationApplicationToCRM } from '../shared/interfaces/converters/notification-application.web.to.crm';
import { iLookupData } from '../shared/interfaces/lookup-data.interface';
import { ServiceNotAvailableComponent } from '../shared/service-not-available.component';

@Component({
  standalone: false,
  selector: 'app-notification-application',
  templateUrl: './notification-application.component.html',
  styleUrls: ['./notification-application.component.scss']
})
export class NotificationApplicationComponent extends FormBase implements OnInit {
  @ViewChild('stepper', { static: true }) applicationStepper: MatStepper;
  isIE: boolean = false;
  didLoad: boolean = false;
  declare showValidationMessage: boolean;
  submitting: boolean = false;
  public currentFormStep: number = 0;
  public showPrintView: boolean = false;
  formType = FORM_TYPES.NOTIFICATION_APPLICATION;

  elements: string[] = [
    'overview',
    'caseInformation',
    'applicantInformation',
    'recipientDetails',
    'authorizationInformation'
  ];

  lookupData: iLookupData = {
    countries: [],
    provinces: [],
    cities: [],
    courts: []
  };

  showConfirmation: boolean = false;

  caseInfoHelper = new CaseInfoInfoHelper();
  applicantInfoInfoHelper = new ApplicantInfoHelper();
  recipientDetailsHelper = new RecipientDetailsHelper();
  authInfoHelper = new AuthInfoHelper();

  window = window;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private lookupService: LookupService,
    private titleService: Title,
    private applicationService: ApplicationService,
    private notify: NotificationQueueService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle(FORM_TITLES.NOTIFICATION_APPLICATION);
    var ua = window.navigator.userAgent;
    this.isIE = /MSIE|Trident/.test(ua);
    this.form = this.buildApplicationForm();
    this.form.valueChanges.subscribe((val) => {
      this.showValidationMessage = this.hasInvalidTouchedControls(this.form);
    });

    let promise_array = [];

    promise_array.push(
      new Promise<void>((resolve, reject) => {
        this.lookupService.getCountries().subscribe(
          (res) => {
            this.lookupData.countries = res.value;
            if (this.lookupData.countries) {
              this.lookupData.countries.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
            }
            resolve();
          },
          (err) => {
            reject();
          }
        );
      })
    );

    promise_array.push(
      new Promise<void>((resolve, reject) => {
        this.lookupService.getProvinces().subscribe(
          (res) => {
            this.lookupData.provinces = res.value;
            if (this.lookupData.provinces) {
              this.lookupData.provinces.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
            }
            resolve();
          },
          (err) => {
            reject();
          }
        );
      })
    );

    Promise.all(promise_array)
      .then((res) => {
        this.didLoad = true;
      })
      .catch((err) => {
        this.snackBar.openFromComponent(ServiceNotAvailableComponent, {
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      });
  }

  buildApplicationForm(): FormGroup {
    let group = {
      overview: this.fb.group({}),
      caseInformation: this.caseInfoHelper.setupFormGroup(this.fb, this.formType.val),
      applicantInformation: this.applicantInfoInfoHelper.setupFormGroup(this.fb, this.formType.val),
      recipientDetails: this.recipientDetailsHelper.setupFormGroup(this.fb, this.formType.val),
      authorizationInformation: this.authInfoHelper.setupFormGroup(this.fb, this.formType.val),
      confirmation: this.fb.group({ confirmationNumber: '' })
    };

    return this.fb.group(group);
  }

  harvestForm(): iNotificationApplication {
    let data = {
      CaseInformation: this.form.get('caseInformation').value as iCaseInformation,
      ApplicantInformation: this.form.get('applicantInformation').value as iApplicantInformation,
      RecipientDetails: this.form.get('recipientDetails').value as iRecipientDetails,
      AuthorizationInformation: this.form.get('authorizationInformation').value as iAuthorizationInformation
    } as iNotificationApplication;

    //using this as a workaround to collect values from disabled fields
    if (data.ApplicantInformation.applicantInfoSameAsVictim == true) {
      data.ApplicantInformation.firstName = data.CaseInformation.firstName;
      data.ApplicantInformation.middleName = data.CaseInformation.middleName;
      data.ApplicantInformation.lastName = data.CaseInformation.lastName;
      data.ApplicantInformation.birthDate = data.CaseInformation.birthDate;
      data.ApplicantInformation.gender = data.CaseInformation.gender;
    }

    if (
      data.RecipientDetails.designate &&
      data.RecipientDetails.designate.length > 0 &&
      data.RecipientDetails.designate[0].addressSameAsApplicant == true
    ) {
      data.RecipientDetails.designate[0].address = data.ApplicantInformation.address;
    }

    return data;
  }

  submit() {
    if (this.form.valid) {
      this.submitting = true;
      let application = this.harvestForm();
      let data = convertNotificationApplicationToCRM(application);
      this.applicationService.submit(data).subscribe(
        (res) => {
          this.submitting = false;
          if (res.IsSuccess) {
            this.form.get('confirmation.confirmationNumber').patchValue('RXXXXXX');
            this.showConfirmation = true;
            setTimeout(() => {
              this.gotoNextStep(this.applicationStepper);
            }, 0);
          } else {
            this.notify.addNotification('There was an error submitting the application.', 'danger', 4000);
          }
        },
        (err) => {
          this.notify.addNotification('There was an error submitting the application.', 'danger', 4000);
          this.submitting = false;
        }
      );
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  exit() {
    this.router.navigate(['']);
  }

  downloadPDF() {}
}
