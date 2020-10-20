import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { noop, Observable, Observer, of, throwError } from 'rxjs';
import { retry, catchError, map, switchMap, tap } from 'rxjs/operators';
import { config } from "../../../../config";
import { CitiesSearchResponse, iCity, iLookupData } from "../../../models/lookup-data.model";
import { EnumHelper, MY_FORMATS, } from "../../enums-list";
import { FormBase } from "../../form-base";
import { RecipientDetailsHelper } from "./recipient-details.helper";

@Component({
    selector: 'app-recipient-details',
    templateUrl: './recipient-details.component.html',
    styleUrls: ['./recipient-details.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class RecipientDetailsComponent extends FormBase implements OnInit {
    @Input() lookupData: iLookupData;
    public form: FormGroup;

    NOTIFICATION_METHODS: string[] = [];

    //city search, let's default to B.C. Canada
    countryVal: string = config.canada.name;
    provinceVal: string = config.canada.defaultProvince;
    cityList: string[] = [];
    search: string;
    suggestions$: Observable<iCity[]>;
    errorMessage: string;

    EnumHelper = new EnumHelper();
    recipientDetailsHelper = new RecipientDetailsHelper();

    apiUrl = 'api/Lookup';

    constructor(private controlContainer: ControlContainer,
        private http: HttpClient,
        private fb: FormBuilder,) {
        super();
    }

    get headers(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    protected handleError(err): Observable<never> {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = err.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}, body was: ${err.message}`;
        }
        return throwError(errorMessage);
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("recipient details component");
        console.log(this.form);

        this.NOTIFICATION_METHODS = [
            'courtUpdates',
            'courtResults',
            'courtAppearances',
            'courtOrders',
            'correctionsInformation',
        ];

        //city search
        this.suggestions$ = new Observable((observer: Observer<string>) => {
            // let workers = this.form.get('victimServiceWorker')['controls'][0].get('city')
            // let cityControl = workers.controls[0].get('city');
            observer.next(this.form.get('victimServiceWorker')['controls'][0].get('city').value.toString());
        }).pipe(
            switchMap((query: string) => {
                if (query) {
                    let searchVal = this.form.get('victimServiceWorker')['controls'][0].get('city').value.toString();
                    let limit = 15;
                    // return this.http.get<any>(`${this.apiUrl}/cities/search?searchVal=${searchVal}&limit=${limit}`, { headers: this.headers }).pipe(
                    return this.http.get<any>(`${this.apiUrl}/cities/search?country=${this.countryVal}&province=${this.provinceVal}&searchVal=${searchVal}&limit=${limit}`, { headers: this.headers }).pipe(
                        retry(3),
                        catchError(this.handleError)
                    ).pipe(
                        map((data: CitiesSearchResponse) => {
                            if (data && data.CityCollection) {
                                data.CityCollection.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
                                return data.CityCollection;
                            }
                            else return [];
                        }),
                        tap(() => noop, err => {
                            // in case of http error
                            this.errorMessage = err && err.message || 'Something goes wrong';
                        })
                    );
                }
                return of([]);
            })
        );
    }

    setupVictimAndDesignate(addVictim: boolean, addDesignate: boolean) {
        let vsw = this.form.get('victimServiceWorker') as FormArray;
        if (addVictim && vsw.length == 0) {
            vsw.push(this.recipientDetailsHelper.createVictimServiceWorker(this.fb));
        }
        else if (!addVictim && vsw.length > 0) {
            vsw.removeAt(0);
        }

        let designate = this.form.get('designate') as FormArray;
        if (addDesignate && designate.length == 0) {
            designate.push(this.recipientDetailsHelper.createDesignate(this.fb));
        }
        else if (!addDesignate && designate.length > 0) {
            designate.removeAt(0);
        }

        console.log(this.form);
    }

    checkAtLeastOneNotification() {
        let x: AbstractControl[] = [];
        this.NOTIFICATION_METHODS.forEach((method) => {
            x.push(this.form.get(method));
        });

        let oneChecked = false;
        x.forEach(c => {
            if (oneChecked)
                return;
            if (c instanceof FormControl) {
                if (c.value === true)
                    oneChecked = true;
            }
        });

        let val = oneChecked ? 'valid' : '';
        this.form.get('atLeastOneNotification').patchValue(val)
    }

    contactMethodChange(item: FormGroup) {
        let type = item.get('type').value;
        let current_validators = [];
        switch (type) {
            case 'telephone': {
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                break;
            }
            case 'mobile': {
                current_validators = [Validators.minLength(10), Validators.maxLength(15)];
                break;
            }
            case 'email': {
                current_validators = [Validators.email];
                break;
            }
            default: {
                break;
            }
        }

        this.setControlValidators(item.get('val'), current_validators);
        item.get('val').patchValue('');
    }

    checkAtLeastOneContactMethod() {
        let isValid = false;
        let designates = this.form.get('designate') as FormArray;
        if (designates.length == 0) return;

        let contactMethods = designates.controls[0].get('contactMethods') as FormArray;
        for (let i = 0; i < contactMethods.controls.length; ++i) {
            let thisMethod = contactMethods.controls[i];
            if (thisMethod.get('val').value && thisMethod.get('val').valid && thisMethod.get('leaveMessage').value == true) {
                isValid = true;
            }
        }

        let val = isValid ? 'valid' : '';

        designates.controls[0].get('atLeastOneContactMethod').patchValue(val);
    }
}