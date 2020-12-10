import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IClientParameters, ICornetParameters } from '../shared/interfaces/cornet-api-parameters.interface';


@Injectable({
    providedIn: 'root'
})
export class CornetService {
    apiUrl = 'api/Cornet';

    constructor(
        private http: HttpClient,
    ) { }

    getClients(parameters: IClientParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/clients?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getAuthorityDocument(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/authority-document?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getHearing(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/hearing?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getKeyDate(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/key-date?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getMovement(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/movement?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getStateTransition(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/state-transition?${query_parameters}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getVictimContact(parameters: ICornetParameters): Observable<any> {
        let params = []
        for (let key in parameters) {
            params.push(key + "=" + parameters[key]);
        }
        let query_parameters = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/victim-contact?${query_parameters}`, { headers: this.headers }).pipe(
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