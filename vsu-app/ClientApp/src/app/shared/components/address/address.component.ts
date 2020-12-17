import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { noop, Observable, Observer, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, switchMap, tap } from 'rxjs/operators';
import { CitiesSearchResponse, iCity, iCountry, iLookupData, iProvince } from '../../interfaces/lookup-data.interface';
import { config } from '../../../../config';
import { POSTAL_CODE, ZIP_CODE } from '../../regex.constants';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {
  countryList: iCountry[] = config.preferred_countries;
  preferred_countries: iCountry[] = config.preferred_countries;
  postalRegex = POSTAL_CODE;
  zipRegex = ZIP_CODE;

  provinceList: iProvince[];
  provinceType: string;
  postalCodeType: string;
  postalCodeSample: string;

  cityList: string[] = [];
  search: string;
  suggestions$: Observable<iCity[]>;
  errorMessage: string;

  apiUrl = 'api/Lookup';

  @Input() group = FormGroup;
  @Input() showChildrenAsRequired: boolean = true;
  @Input() disabled: boolean = false;
  @Input() lookupData: iLookupData;

  constructor(public lookupService: LookupService,
    private http: HttpClient,) {
    this.provinceType = config.canada.areaType;
    this.postalCodeType = config.canada.postalCodeName;
    this.postalCodeSample = config.canada.postalCodeSample;
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
    //city search
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      observer.next(this.group['controls']['city'].value.toString());
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          let countryVal = this.group['controls']['country'].value.toString();
          let provinceVal = this.group['controls']['province'].value.toString();
          let searchVal = this.group['controls']['city'].value.toString();
          let limit = 15;
          return this.http.get<any>(`${this.apiUrl}/cities/search?country=${countryVal}&province=${provinceVal}&searchVal=${searchVal}&limit=${limit}`, { headers: this.headers }).pipe(
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

    this.countryList = config.preferred_countries;
    this.provinceList = [];

    let promise_array = [];
    if (!this.lookupData.countries || this.lookupData.countries.length == 0) {
      promise_array.push(new Promise<void>((resolve, reject) => {
        this.lookupService.getCountries().subscribe((res) => {
          this.lookupData.countries = res.value;
          if (this.lookupData.countries) {
            this.lookupData.countries.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
          }
          resolve();
        }, (err) => {

        });
      }));
    }

    if (!this.lookupData.provinces || this.lookupData.provinces.length == 0) {
      promise_array.push(new Promise<void>((resolve, reject) => {
        this.lookupService.getProvinces().subscribe((res) => {
          this.lookupData.provinces = res.value;
          if (this.lookupData.provinces) {
            this.lookupData.provinces.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
          }
          resolve();
        }, (err) => {

        });
      }));
    }

    Promise.all(promise_array).then((res) => {
      this.setupForm();
    });
  }

  setupForm() {
    if (this.showChildrenAsRequired === undefined) {
      this.showChildrenAsRequired = true;
    }

    let pref_countries = this.lookupData.countries.filter(c => config.preferred_countries.findIndex(pc => pc.vsd_countryid == c.vsd_countryid) >= 0);
    let remaining_countries = this.lookupData.countries.filter(c => config.preferred_countries.findIndex(pc => pc.vsd_countryid == c.vsd_countryid) < 0);

    pref_countries.sort(function (a, b) {
      return config.preferred_countries.findIndex(c => c.vsd_countryid == a.vsd_countryid) - config.preferred_countries.findIndex(c => c.vsd_countryid == b.vsd_countryid);
    });

    remaining_countries.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));

    this.countryList = pref_countries.concat(remaining_countries);
    this.cityList = this.lookupData.cities.map(c => c.vsd_name);

    this.provinceType = config.canada.areaType;
    this.postalCodeType = config.canada.postalCodeName;
    this.postalCodeSample = config.canada.postalCodeSample;

    let countryVal = this.group['controls']['country'].value.toString();
    let selectedCountry = this.lookupData.countries.filter(c => c.vsd_name.toLowerCase() == countryVal.toLowerCase())[0];
    if (!selectedCountry) {
      selectedCountry = this.lookupData.countries.filter(p => p.vsd_name.toLowerCase() === 'canada')[0];
    }

    if (selectedCountry) {
      this.provinceList = this.lookupData.provinces.filter(p => p._vsd_countryid_value === selectedCountry.vsd_countryid);
      this.provinceList.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
    }

    if (selectedCountry) {
      this.setProvinceAndPostalType(selectedCountry.vsd_name);
    }
    this.setProvinceValidators();
  }

  isSubFieldValid(field: string, disabled: boolean) {
    if (disabled === true) return true;
    let formField = this.group['controls'][field];
    if (formField == null)
      return true;

    return formField.valid || !formField.touched;
  }

  onCountryChange(event) {
    let selection = event.target.value.toLowerCase();
    let selectedCountry = this.lookupData.countries.filter(c => c.vsd_name.toLowerCase() == selection)[0];
    if (selectedCountry) {
      this.provinceList = this.lookupData.provinces.filter(p => p._vsd_countryid_value === selectedCountry.vsd_countryid);
      if (this.provinceList) {
        this.provinceList.sort((a, b) => a.vsd_name.localeCompare(b.vsd_name));
      }

      let provinceControl = this.group['controls']['province'] as FormControl;
      provinceControl.patchValue('');
      this.setProvinceValidators();

      let postalControl = this.group['controls']['postalCode'] as FormControl;
      postalControl.patchValue('');

      this.setProvinceAndPostalType(selectedCountry.vsd_name);
    }
    else {
      this.provinceList = [];
      this.cityList = this.lookupData.cities.map(c => c.vsd_name);
      this.setProvinceAndPostalType("");
    }
  }

  onProvinceChange(event) {

  }

  setProvinceAndPostalType(country: string) {
    let postalControl = this.group['controls']['postalCode'] as FormControl;
    if (country.toLowerCase() === 'canada') {
      if (this.showChildrenAsRequired) {
        postalControl.setValidators([Validators.required, Validators.pattern(this.postalRegex)]);
      }
      else {
        postalControl.setValidators([Validators.pattern(this.postalRegex)]);
      }
      this.provinceType = config.canada.areaType;
      this.postalCodeType = config.canada.postalCodeName;
      this.postalCodeSample = config.canada.postalCodeSample;
    }
    else if (country.toLowerCase() === 'united states of america') {
      if (this.showChildrenAsRequired) {
        postalControl.setValidators([Validators.required, Validators.pattern(this.zipRegex)]);
      }
      else {
        postalControl.setValidators([Validators.pattern(this.zipRegex)]);
      }
      this.provinceType = config.usa.areaType;
      this.postalCodeType = config.usa.postalCodeName;
      this.postalCodeSample = config.usa.postalCodeSample;
    }
    else {
      if (this.showChildrenAsRequired) {
        postalControl.setValidators([Validators.required]);
      }
      else {
        postalControl.clearValidators();
      }
      this.provinceType = "Province/State";
      this.postalCodeType = "Postal/ZIP Code";
      this.postalCodeSample = "";
    }
    postalControl.updateValueAndValidity();
  }

  setProvinceValidators() {
    let provinceControl = this.group['controls']['province'] as FormControl;

    if (this.provinceList.length > 0 && this.showChildrenAsRequired) {
      provinceControl.setValidators([Validators.required]);
      provinceControl.updateValueAndValidity();
    }
    else {
      provinceControl.clearValidators();
      provinceControl.updateValueAndValidity();
    }
  }
}
