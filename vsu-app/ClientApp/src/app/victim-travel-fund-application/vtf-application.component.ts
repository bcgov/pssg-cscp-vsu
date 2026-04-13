import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/api/application/application.service';
import { LookupService } from 'src/api/lookup/lookup.service';
import { NotificationQueueService } from '../services/notification-queue.service';
import { ApplicantInfoHelper } from '../shared/components/applicant-information/applicant-information.helper';
import { AuthInfoHelper } from '../shared/components/authorization/authorization.helper';
import { CaseInfoInfoHelper } from '../shared/components/case-information/case-information.helper';
import { TravelInfoHelper } from '../shared/components/travel-information/travel-information.helper';
import { TravelOverviewInfoHelper } from '../shared/components/travel-overview/travel-overview.helper';
import { FORM_TITLES, FORM_TYPES } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import {
  iApplicantInformation,
  iAuthorizationInformation,
  iCaseInformation,
  iOverviewInformation,
  iTravelFundApplication,
  iTravelInformation
} from '../shared/interfaces/application.interface';
import { convertTravelFundApplicationToCRM } from '../shared/interfaces/converters/travel-fund-application.web.to.crm';
import { iLookupData } from '../shared/interfaces/lookup-data.interface';

@Component({
  standalone: false,
  selector: 'app-vtf-application',
  templateUrl: './vtf-application.component.html',
  styleUrls: ['./vtf-application.component.scss']
})
export class VictimTravelFundApplicationComponent extends FormBase implements OnInit {
  @ViewChild('stepper', { static: true }) applicationStepper: MatStepper;
  isIE: boolean = false;
  didLoad: boolean = false;

  submitting: boolean = false;
  public currentFormStep: number = 0;
  public showPrintView: boolean = false;
  formType = FORM_TYPES.TRAVEL_FUNDS_APPLICATION;

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
    courts: [],
    offences: []
  };

  showConfirmation: boolean = false;

  overviewHelper = new TravelOverviewInfoHelper();
  caseInfoHelper = new CaseInfoInfoHelper();
  applicantInfoInfoHelper = new ApplicantInfoHelper();
  travelInfoHelper = new TravelInfoHelper();
  authInfoHelper = new AuthInfoHelper();

  window = window;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private lookupService: LookupService,
    private titleService: Title,
    private applicationService: ApplicationService,
    private notify: NotificationQueueService
  ) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle(FORM_TITLES.TRAVEL_FUNDS_APPLICATION);
    var ua = window.navigator.userAgent;
    this.isIE = /MSIE|Trident/.test(ua);
    this.form = this.buildApplicationForm();
    this.form.valueChanges.subscribe((val) => {
      this.showValidationMessage = this.hasInvalidTouchedControls(this.form);
    });

    let promise_array = [];

    promise_array.push(
      new Promise<void>((resolve, reject) => {
        this.lookupService.getApiLookupCountries<any>().subscribe(
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
        this.lookupService.getApiLookupProvinces<any>().subscribe(
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

    promise_array.push(
      new Promise<void>((resolve, reject) => {
        this.lookupService.getApiLookupOffences<any>().subscribe(
          (res) => {
            this.lookupData.offences = res.value;
            if (this.lookupData.offences) {
              this.lookupData.offences.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
            }
            resolve();
          },
          (err) => {
            this.notify.addNotification('Encountered an error getting offence information.', 'warning', 3000);
            reject();
          }
        );
      })
    );

    Promise.all(promise_array)
      .then((res) => {
        this.didLoad = true;
      })
      .catch(() => {
        this.router.navigateByUrl('/outage');
      });
  }

  buildApplicationForm(): FormGroup {
    let group = {
      overview: this.overviewHelper.setupFormGroup(this.fb, this.formType.val),
      applicantInformation: this.applicantInfoInfoHelper.setupFormGroup(this.fb, this.formType.val),
      caseInformation: this.caseInfoHelper.setupFormGroup(this.fb, this.formType.val),
      travelInformation: this.travelInfoHelper.setupFormGroup(this.fb, this.formType.val),
      authorizationInformation: this.authInfoHelper.setupFormGroup(this.fb, this.formType.val),
      confirmation: this.fb.group({ confirmationNumber: '' })
    };

    return this.fb.group(group);
  }

  downloadPDF() {}

  harvestForm(): iTravelFundApplication {
    let data = {
      OverviewInformation: this.form.get('overview').value as iOverviewInformation,
      ApplicantInformation: this.form.get('applicantInformation').value as iApplicantInformation,
      CaseInformation: this.form.get('caseInformation').value as iCaseInformation,
      TravelInformation: this.form.get('travelInformation').value as iTravelInformation,
      AuthorizationInformation: this.form.get('authorizationInformation').value as iAuthorizationInformation
    } as iTravelFundApplication;

    //using this as a workaround to collect values from disabled fields
    if (data.CaseInformation.victimInfoSameAsApplicant == true) {
      data.CaseInformation.firstName = data.ApplicantInformation.firstName;
      data.CaseInformation.middleName = data.ApplicantInformation.middleName;
      data.CaseInformation.lastName = data.ApplicantInformation.lastName;
      data.CaseInformation.birthDate = data.ApplicantInformation.birthDate;
      data.CaseInformation.gender = data.ApplicantInformation.gender;
    }

    return data;
  }

  submit() {
    if (this.form.valid) {
      this.submitting = true;

      let application = this.harvestForm();
      let data = convertTravelFundApplicationToCRM(application);

      this.applicationService.postApiApplicationVtf(data).subscribe({
        next: (res) => {
          this.form.get('confirmation.confirmationNumber').patchValue('RXXXXXX');
          this.showConfirmation = true;
          setTimeout(() => {
            this.gotoNextStep(this.applicationStepper);
          }, 0);
        },
        error: (err) => {
          this.notify.addNotification('There was an error submitting the application.', 'danger', 4000);
        },
        complete: () => {
          this.submitting = false;
        }
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }
}
