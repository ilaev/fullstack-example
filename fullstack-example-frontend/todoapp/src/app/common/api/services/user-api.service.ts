import { TodoItemDto } from './../todo-item-dto';
import { TodoListDto } from './../todo-list-dto';
import { TODO_API_SETTINGS_INJECTION_TOKEN, TodoApiSettings } from './../todo-api-settings';
import { ApiErrorHandler } from './../api-error-handler';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ensureTrailingSlash } from '../../string-utility';
import { UserDto } from '../user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    @Inject(TODO_API_SETTINGS_INJECTION_TOKEN) private settings: TodoApiSettings,
    private errorHandler: ApiErrorHandler,
    private httpClient: HttpClient) { }

  public getCurrentUser(): Observable<UserDto> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'users/@me';
    return this.httpClient.get<UserDto>(apiEndpoint).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public getListsOfCurrentUser(): Observable<TodoListDto[]> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'users/@me/lists';
    return this.httpClient.get<TodoListDto[]>(apiEndpoint).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public getItemsOfCurrentUser(): Observable<TodoItemDto[]> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'users/@me/items';
    return this.httpClient.get<TodoItemDto[]>(apiEndpoint).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }
}
