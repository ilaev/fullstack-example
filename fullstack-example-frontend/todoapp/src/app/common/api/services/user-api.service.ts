import { TODO_API_SETTINGS_INJECTION_TOKEN, TodoApiSettings } from './../todo-api-settings';
import { ApiErrorHandler } from './../api-error-handler';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ensureTrailingSlash } from '../../string-utility';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    @Inject(TODO_API_SETTINGS_INJECTION_TOKEN) private settings: TodoApiSettings,
    private errorHandler: ApiErrorHandler,
    private httpClient: HttpClient) { }

  public getCurrentUser(): Observable<any> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + '/user/@me';
    // return this.httpClient.get(apiEndpoint).pipe(
    //   catchError((err, caught) => this.errorHandler.handleError(err))
    // );
    // tmp mock until server is ready
    // TODO: for a later demo hosting scenario, I will need an in-memomy-cache to avoid any potential abuse of the system.
    // decision has to be made, no idea about the laws in germany in regards to whether it's okay to host such demo apps.
    // but since these apps won't be maintained by me for long because that would be too time consuming, someone could abuse the server should there be any security issues.  
    return of({
      id: '960b9dbc-87c1-492c-b042-84d4dab14e9d',
      email: 'dwight.eisenhower@outlook.com',
      name: 'Dwight Eisenhower',
      avatar: 'placeholder',
      createdAt: '2021-08-01T21:45:13.982Z',
      modifiedAt: '2021-08-01T21:45:13.982Z',
    })
  }
}
