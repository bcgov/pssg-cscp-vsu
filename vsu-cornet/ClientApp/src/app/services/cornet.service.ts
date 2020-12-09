import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IClientParameters } from '../shared/interfaces/client-search.interface';


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
        let search_string = params.join("&");
        return this.http.get<any>(`${this.apiUrl}/clients?${search_string}`, { headers: this.headers }).pipe(
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