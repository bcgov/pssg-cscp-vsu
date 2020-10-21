import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LookupService {
  apiUrl = 'api/Lookup';

  constructor(
    private http: HttpClient,
  ) { }

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countries`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getProvinces(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/provinces`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cities`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  searchCities(country: string, province: string, searchVal: string): Observable<any> {
    let limit = 20;
    return this.http.get<any>(`${this.apiUrl}/cities/search?country=${country}&province=${province}&searchVal=${searchVal}&limit=${limit}`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }


  getCitiesByCountry(country: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/country/${country}/cities`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCitiesByProvince(country: string, province: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/country/${country}/province/${province}/cities`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCourts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courts`, { headers: this.headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
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
}
