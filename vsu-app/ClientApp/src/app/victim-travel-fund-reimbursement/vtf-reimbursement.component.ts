import { ApplicationService } from "../services/application.service";
import { AuthInfoHelper } from "../shared/components/authorization/authorization.helper";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FORM_TITLES, FORM_TYPES } from "../shared/enums-list";
import { FormBase } from "../shared/form-base";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LookupService } from "../services/lookup.service";
import { MatVerticalStepper } from "@angular/material";
import { NotificationQueueService } from "../services/notification-queue.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { VTFCaseInfoHelper } from "../shared/components/vtf-case-information/vtf-case-information.helper";
import { iLookupData } from "../shared/interfaces/lookup-data.interface";
import { TravelExpensesHelper } from "../shared/components/travel-expenses/travel-expenses.helper";
import { convertTravelFundApplicationToCRM } from "../shared/interfaces/converters/travel-fund-application.web.to.crm";

enum PAGES {
    CASE_INFORMATION,
    TRAVEL_AND_EXPENSES,
    DECLARATION,
    CONFIRMATION
}

@Component({
    selector: 'app-vtf-reimbursement',
    templateUrl: './vtf-reimbursement.component.html',
    styleUrls: ['./vtf-reimbursement.component.scss']
})
export class VictimTravelFundReimbursementComponent extends FormBase implements OnInit {
    @ViewChild('stepper', { static: true }) applicationStepper: MatVerticalStepper;
    isIE: boolean = false;
    didLoad: boolean = false;

    submitting: boolean = false;
    public currentFormStep: number = 0;
    public showPrintView: boolean = false;
    formType = FORM_TYPES.TRAVEL_FUNDS_REIMBURSEMENT;

    PAGES = PAGES;

    elements: string[] = ['caseInformation', 'applicantInformation', 'travelExpenses', 'authorizationInformation'];

    lookupData: iLookupData = {
        countries: [],
        provinces: [],
        cities: [],
        courts: [],
        offences: [],
    };

    showConfirmation: boolean = false;

    vtfCaseInfoHelper = new VTFCaseInfoHelper();
    travelExpensesHelper = new TravelExpensesHelper();
    authInfoHelper = new AuthInfoHelper();

    window = window;

    constructor(public fb: FormBuilder,
        private router: Router,
        private lookupService: LookupService,
        private titleService: Title,
        private applicationService: ApplicationService,
        private notify: NotificationQueueService
    ) {
        super();
    }

    ngOnInit() {
        this.titleService.setTitle(FORM_TITLES.TRAVEL_FUNDS_REIMBURSEMENT);
        var ua = window.navigator.userAgent;
        this.isIE = /MSIE|Trident/.test(ua);
        this.form = this.buildApplicationForm();

        let promise_array = [];

        promise_array.push(new Promise<void>((resolve, reject) => {
            this.lookupService.getCountries().subscribe((res) => {
                this.lookupData.countries = res.value;
                if (this.lookupData.countries) {
                    this.lookupData.countries.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                }
                resolve();
            }, (err) => {
                this.notify.addNotification("Encountered an error getting country information.", "warning", 3000);
            });
        }));

        promise_array.push(new Promise<void>((resolve, reject) => {
            this.lookupService.getProvinces().subscribe((res) => {
                this.lookupData.provinces = res.value;
                if (this.lookupData.provinces) {
                    this.lookupData.provinces.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                }
                resolve();
            }, (err) => {
                this.notify.addNotification("Encountered an error getting province information.", "warning", 3000);
            });
        }));

        promise_array.push(new Promise<void>((resolve, reject) => {
            this.lookupService.getOffences().subscribe((res) => {
                this.lookupData.offences = res.value;
                if (this.lookupData.offences) {
                    this.lookupData.offences.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                }
                resolve();
            }, (err) => {
                this.notify.addNotification("Encountered an error getting offence information.", "warning", 3000);
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
            caseInformation: this.vtfCaseInfoHelper.setupFormGroup(this.fb, this.formType.val),
            travelExpenses: this.travelExpensesHelper.setupFormGroup(this.fb, this.formType.val),
            authorizationInformation: this.authInfoHelper.setupFormGroup(this.fb, this.formType.val),
            confirmation: this.fb.group({ confirmationNumber: "" }),
        };

        return this.fb.group(group);
    }

    downloadPDF() {
        console.log("download pdf");
    }

    harvestForm() {
        console.log("TODO - update harvest form!");
        return {};
        // let data = {
        //     CaseInformation: this.form.get('caseInformation').value as iCaseInformation,
        //     TravelInformation: this.form.get('travelExpenses').value as iTravelInformation,
        //     AuthorizationInformation: this.form.get('authorizationInformation').value as iAuthorizationInformation,
        // } as iTravelFundApplication;

        // return data;
    }

    submit() {
        console.log("TODO -submit");
        // this.applicationService.testSplunk().subscribe((res) => {
        //     console.log(res);
        // }, (err) => {
        //     console.log(err);
        // });
        console.log(this.form);
        if (this.form.valid) {
            this.submitting = true;
            console.log("form is valid - submit");
            let application = this.harvestForm();
            let data = {};
            console.log(data);
            this.applicationService.submitTEST(data).subscribe((res) => {
                this.submitting = false;
                console.log(res);
                if (res.IsSuccess) {
                    console.log("CONFIRMATION NUMBER SHOULD COME FROM CRM");
                    this.form.get('confirmation.confirmationNumber').patchValue('RXXXXXX');
                    this.showConfirmation = true;
                    setTimeout(() => {
                        this.gotoNextStep(this.applicationStepper);
                    }, 0);
                }
                else {
                    this.notify.addNotification("There was an error submitting the application.", "danger", 4000);
                    console.log(res.Result);
                }
            }, (err) => {
                this.notify.addNotification("There was an error submitting the application.", "danger", 4000);
                console.log(err);
                this.submitting = false;
            });
        }
        else {
            console.log("form is NOT valid - NO submit");
            this.validateAllFormFields(this.form);
        }
    }
}