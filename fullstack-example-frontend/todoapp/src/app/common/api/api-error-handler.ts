import { API_LOGGER_INJECTION_TOKEN } from './api-logger-injection-token';

import { HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Logger } from '../log';

@Injectable({
    providedIn: 'root'
})
export class ApiErrorHandler {
    constructor(
        @Inject(API_LOGGER_INJECTION_TOKEN) private logger: Logger) {
        if (!logger) {
            throw new Error('ApiErrorHandler. A logger is required.')
        }
    }

    public handleError(errResponse: HttpErrorResponse): Observable<never> {
        if (errResponse.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            this.logger.logError('A client-side or network error occurred: ' + errResponse.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            this.logger.logError('The backend returned an unsuccessful response code: ' +
            errResponse.status + ' ' + errResponse.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something went wrong. Retry once again in a few minutes.');
    }
}

