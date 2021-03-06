import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICoastOffender } from '../shared/interfaces/client-details.interface';


@Injectable({
    providedIn: 'root'
})
export class OffenderService {
    apiUrl = 'api/Offender';

    constructor(
        private http: HttpClient,
    ) { }

    getOffenderByCSNumber(csNumber: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/cs-number/${csNumber}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    getOffenderById(offenderId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${offenderId}`, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    createOffender(offender: ICoastOffender): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, offender, { headers: this.headers }).pipe(
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