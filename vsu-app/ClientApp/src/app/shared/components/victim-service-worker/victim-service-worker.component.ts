import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { noop, Observable, Observer, of, throwError } from 'rxjs';
import { retry, catchError, map, switchMap, tap } from 'rxjs/operators';
import { config } from "../../../../config";
import { ApplicationType } from "../../enums-list";
import { FormBase } from "../../form-base";
import { CitiesSearchResponse, iCity, iLookupData } from "../../interfaces/lookup-data.interface";

@Component({
    selector: 'app-victim-service-worker',
    templateUrl: './victim-service-worker.component.html',
})
export class VSWComponent extends FormBase implements OnInit {
    public form: FormGroup;
    @Input() isDisabled: boolean;
    @Input() isRequired: boolean = false;
    @Input() lookupData: iLookupData;
    @Input() formType: ApplicationType;

    //city search, let's default to B.C. Canada
    countryVal: string = config.canada.name;
    provinceVal: string = config.canada.defaultProvince;
    cityList: string[] = [];
    search: string;
    suggestions$: Observable<iCity[]>;
    errorMessage: string;
    apiUrl = 'api/Lookup';

    ApplicationType = ApplicationType;

    constructor(private controlContainer: ControlContainer,
        private http: HttpClient) {
        super();
    }

    get headers(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    protected handleError(err): Observable<never> {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = err.error.message;
        } else {
            errorMessage = `Backend returned code ${err.status}, body was: ${err.message}`;
        }
        return throwError(errorMessage);
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;

        //city search
        this.suggestions$ = new Observable((observer: Observer<string>) => {
            observer.next(this.form.get('city').value.toString());
        }).pipe(
            switchMap((query: string) => {
                if (query) {
                    let searchVal = this.form.get('city').value.toString();
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
                            this.errorMessage = err && err.message || 'Something goes wrong';
                        })
                    );
                }
                return of([]);
            })
        );
    }


}