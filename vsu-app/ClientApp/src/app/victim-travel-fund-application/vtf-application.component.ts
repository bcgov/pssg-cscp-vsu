import { ApplicantInfoHelper } from "../shared/components/applicant-information/applicant-information.helper";
import { AuthInfoHelper } from "../shared/components/authorization/authorization.helper";
import { CaseInfoInfoHelper } from "../shared/components/case-information/case-information.helper";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FORM_TITLES, FORM_TYPES } from "../shared/enums-list";
import { FormBase } from "../shared/form-base";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LookupService } from "../services/lookup.service";
import { MatVerticalStepper } from "@angular/material";
import { RecipientDetailsHelper } from "../shared/components/recipient-details/recipient-details.helper";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { TravelOverviewInfoHelper } from "../shared/components/travel-overview/travel-overview.helper";
import { iLookupData } from "../shared/interfaces/lookup-data.interface";

@Component({
    selector: 'app-vtf-application',
    templateUrl: './vtf-application.component.html',
    styleUrls: ['./vtf-application.component.scss']
})
export class VictimTravelFundApplicationComponent extends FormBase implements OnInit {
    @ViewChild('stepper', { static: true }) applicationStepper: MatVerticalStepper;
    isIE: boolean = false;
    didLoad: boolean = false;

    submitting: boolean = false;
    public currentFormStep: number = 0;
    public showPrintView: boolean = false;
    formType = FORM_TYPES.TRAVEL_FUNDS_APPLICATION;

    elements: string[] = ['overview', 'caseInformation', 'applicantInformation', 'recipientDetails', 'authorizationInformation'];

    lookupData: iLookupData = {
        countries: [],
        provinces: [],
        cities: [],
        courts: [],
    };

    showConfirmation: boolean = false;

    overviewHelper = new TravelOverviewInfoHelper();
    caseInfoHelper = new CaseInfoInfoHelper();
    applicantInfoInfoHelper = new ApplicantInfoHelper();
    recipientDetailsHelper = new RecipientDetailsHelper();
    authInfoHelper = new AuthInfoHelper();

    window = window;

    constructor(public fb: FormBuilder,
        private router: Router,
        private lookupService: LookupService,
        private titleService: Title,
    ) {
        super();
    }

    ngOnInit() {
        this.titleService.setTitle(FORM_TITLES.TRAVEL_FUNDS_APPLICATION);
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
            overview: this.overviewHelper.setupFormGroup(this.fb),
            applicantInformation: this.applicantInfoInfoHelper.setupFormGroup(this.fb),
            caseInformation: this.caseInfoHelper.setupFormGroup(this.fb),
            travelInformation: this.fb.group({}),
            authorizationInformation: this.authInfoHelper.setupFormGroup(this.fb),
            confirmation: this.fb.group({ confirmationNumber: "" }),
        };

        return this.fb.group(group);
    }

    downloadPDF() {
        console.log("download pdf");
    }

    submit() {
        this.showConfirmation = true;
        setTimeout(() => {
            this.gotoNextStep(this.applicationStepper);
        }, 0);
        console.log("TODO!! -- disable form");
    }
}