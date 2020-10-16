import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper, MatVerticalStepper } from '@angular/material';
import { Router } from '@angular/router';
import { iLookupData } from '../models/lookup-data.model';
import { LookupService } from '../services/lookup.service';
import { ApplicantInfoHelper } from '../shared/components/applicant-information/applicant-information.helper';
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

    constructor(private fb: FormBuilder,
        private router: Router,
        private lookupService: LookupService,) {
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


    downloadPDF() {
        console.log("download pdf");
    }

    exit() {
        this.router.navigate(['']);
    }

    buildApplicationForm(): FormGroup {
        let group = {
            overview: this.fb.group({
            }),
            caseInformation: this.caseInfoHelper.setupFormGroup(this.fb),
            applicantInformation: this.applicantInfoInfoHelper.setupFormGroup(this.fb),
            recipientDetails: this.recipientDetailsHelper.setupFormGroup(this.fb),
            authorizationInformation: this.fb.group({
            }),
        };

        return this.fb.group(group);
    }

    gotoPage(selectPage: MatStepper): void {
        // When a user clicks on the stepper this is triggered
        window.scroll(0, 0);
        this.showValidationMessage = false;
        this.currentFormStep = selectPage.selectedIndex;
    }

    gotoNextStep(stepper: MatStepper, emptyPage?: boolean): void {
        // when a user clicks the continue button we move them to the next part of the form
        if (stepper) {
            // the stepper indexes match our form indexes
            const desiredFormIndex: number = stepper.selectedIndex;
            // get the text value of the form index
            const formGroupName = this.elements[desiredFormIndex];
            console.log(`Form for validation is ${formGroupName}.`);
            // be sure that the stepper is in range
            if (desiredFormIndex >= 0 && desiredFormIndex < this.elements.length) {
                // collect the matching form group from the form
                const formParts = this.form.get(formGroupName);
                // TODO: how do we know this is true?
                let formValid = true;

                // if there is a form returned with the name
                if (formParts != null) {
                    // collect the validity of it
                    formValid = formParts.valid;
                    console.log(formParts);
                } else {
                    alert('That was a null form. Nothing to validate')
                }

                // Ensure if the page is empty that the form is valid
                if (emptyPage != null) {
                    if (emptyPage == true) {
                        formValid = true;
                        //formParts.valid = true;
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
