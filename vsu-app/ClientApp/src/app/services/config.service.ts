import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Configuration } from '../shared/interfaces/configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  apiUrl = 'api/Configuration';

  constructor(private http: HttpClient) {}

  public async load(): Promise<Configuration> {
    try {
      return await firstValueFrom(
        this.http.get<Configuration>(this.apiUrl, { headers: this.headers }).pipe(catchError(this.handleError))
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected handleError(error): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => `Failed to load configuration: ${(<ErrorEvent>error.error).message}`);
    }

    return throwError(() => `Failed to load configuration: ${(<HttpErrorResponse>error).message}`);
  }
}
