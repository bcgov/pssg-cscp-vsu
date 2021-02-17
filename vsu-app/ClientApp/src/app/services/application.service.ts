import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { iApplicationFormCRM } from '../shared/interfaces/dynamics/crm-application';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    apiUrl = 'api/Application';

    constructor(private http: HttpClient) { }

    submit(application: iApplicationFormCRM): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, application, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    submitTEST(application: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, application, { headers: this.headers }).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

    // testSplunk(): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}`, { headers: this.headers }).pipe(
    //         retry(3),
    //         catchError(this.handleError)
    //     );
    // }

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
}
