import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper, MatVerticalStepper } from '@angular/material';
import { Router } from '@angular/router';
import { iLookupData } from '../models/lookup-data.model';
import { LookupService } from '../services/lookup.service';
import { NotificationQueueService } from '../services/notification-queue.service';
import { ApplicantInfoHelper } from '../shared/components/applicant-information/applicant-information.helper';
import { AuthInfoHelper } from '../shared/components/authorization/authorization.helper';
import { CaseInfoInfoHelper } from '../shared/components/case-information/case-information.helper';
import { RecipientDetailsHelper } from '../shared/components/recipient-details/recipient-details.helper';
import { FormBase } from '../shared/form-base';

@Component({
    selector: 'app-notification-application',
    templateUrl: './noticiation-application.component.html',
    styleUrls: ['./noticiation-application.component.scss']
})
export class NotificationApplicationComponent extends FormBase implements OnInit {
    @ViewChild('stepper', { static: true }) applicationStepper: MatVerticalStepper;
    isIE: boolean = false;
    didLoad: boolean = false;
    showValidationMessage: boolean;
    submitting: boolean = false;
    public currentFormStep: number = 0;
    public showPrintView: boolean = false;

    elements: string[] = ['overview', 'caseInformation', 'applicantInformation', 'recipientDetails', 'authorizationInformation'];

    lookupData: iLookupData = {
        countries: [],
        provinces: [],
        cities: [],
        courts: [],
    };

    caseInfoHelper = new CaseInfoInfoHelper();
    applicantInfoInfoHelper = new ApplicantInfoHelper();
    recipientDetailsHelper = new RecipientDetailsHelper();
    authInfoHelper = new AuthInfoHelper();

    window = window;

    constructor(public fb: FormBuilder,
        private router: Router,
        private lookupService: LookupService,
        private notificationQueueService: NotificationQueueService,) {
        super();
    }

    ngOnInit() {
        var ua = window.navigator.userAgent;
        this.isIE = /MSIE|Trident/.test(ua);
        this.form = this.buildApplicationForm();

        let promise_array = [];

        promise_array.push(new Promise((resolve, reject) => {
            this.lookupService.getCountries().subscribe((res) => {
                this.lookupData.countries = res.value;
                if (this.lookupData.countries) {
                    this.lookupData.countries.sort(function (a, b) {
                        return a.vsd_name.localeCompare(b.vsd_name);
                    });
                }
                resolve();
            });
        }));

        promise_array.push(new Promise((resolve, reject) => {
            this.lookupService.getProvinces().subscribe((res) => {
                this.lookupData.provinces = res.value;
                if (this.lookupData.provinces) {
                    this.lookupData.provinces.sort(function (a, b) {
                        return a.vsd_name.localeCompare(b.vsd_name);
                    });
                }
                resolve();
            });
        }));

        Promise.all(promise_array).then((res) => {
            this.didLoad = true;
            console.log("Lookup data");
            console.log(this.lookupData);
        });
    }

    buildApplicationForm(): FormGroup {
        let group = {
            overview: this.fb.group({
            }),
            caseInformation: this.caseInfoHelper.setupFormGroup(this.fb),
            applicantInformation: this.applicantInfoInfoHelper.setupFormGroup(this.fb),
            recipientDetails: this.recipientDetailsHelper.setupFormGroup(this.fb),
            authorizationInformation: this.authInfoHelper.setupFormGroup(this.fb),
        };

        return this.fb.group(group);
    }

    submit() {
        console.log("submit");
        console.log(this.form);
        // this.submitting = true;
        if (this.form.valid) {
            console.log("form is valid - submit");
            // this.notificationQueueService.addNotification(`Pretending that submit just happened.`, 'success', 5000);
        }
        else {
            console.log("form is NOT valid - NO submit");
            this.validateAllFormFields(this.form);
            // this.notificationQueueService.addNotification(`Form not valid`, 'danger', 50000);
        }
    }

    exit() {
        this.router.navigate(['']);
    }

    downloadPDF() {
        console.log("download pdf");
    }

    gotoPage(selectPage: MatStepper): void {
        // When a user clicks on the stepper this is triggered
        window.scroll(0, 0);
        this.showValidationMessage = false;
        this.currentFormStep = selectPage.selectedIndex;
    }

    gotoNextStep(stepper: MatStepper, emptyPage?: boolean): void {
        if (stepper) {
            const desiredFormIndex: number = stepper.selectedIndex;
            const formGroupName = this.elements[desiredFormIndex];
            console.log(`Form for validation is ${formGroupName}.`);
            if (desiredFormIndex >= 0 && desiredFormIndex < this.elements.length) {
                const formParts = this.form.get(formGroupName);
                let formValid = true;

                if (formParts != null) {
                    formValid = formParts.valid;
                    console.log(formParts);
                } else {
                    alert('That was a null form. Nothing to validate')
                }

                if (emptyPage != null) {
                    if (emptyPage == true) {
                        formValid = true;
                    }
                }

                if (formValid) {
                    console.log('Form is valid so proceeding to next step.')
                    this.showValidationMessage = false;
                    window.scroll(0, 0);
                    stepper.next();
                } else {
                    console.log('Form is not valid rerun the validation and show the validation message.')
                    this.validateAllFormFields(formParts);
                    this.showValidationMessage = true;
                }
            }
        }
    }

    gotoPreviousStep(stepper: MatStepper): void {
        if (stepper) {
            console.log('Going back a step');
            this.showValidationMessage = false;
            window.scroll(0, 0);
            stepper.previous();
        }
    }
}
