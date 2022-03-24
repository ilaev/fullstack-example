import { TodoListDto } from './../todo-list-dto';
import { TodoItemDto } from './../todo-item-dto';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiErrorHandler } from '../api-error-handler';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN } from '../todo-api-settings';
import { ensureTrailingSlash } from '../../string-utility';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {

  constructor(
    @Inject(TODO_API_SETTINGS_INJECTION_TOKEN) private settings: TodoApiSettings,
    private errorHandler: ApiErrorHandler,
    private httpClient: HttpClient) { }

  public createLists(dtos: TodoListDto[]): Observable<any> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'lists';
    return this.httpClient.post(apiEndpoint, dtos).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public updateLists(dtos: TodoListDto[]): Observable<any> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'lists';
    return this.httpClient.put(apiEndpoint, dtos).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public getList(id: string): Observable<TodoListDto> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'lists/' + id;
    return this.httpClient.get<TodoListDto>(apiEndpoint).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public createItems(dtos: TodoItemDto[]): Observable<any> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'items';
    return this.httpClient.post(apiEndpoint, dtos).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  public updateItems(dtos: TodoItemDto[]): Observable<any> {
    const apiEndpoint = ensureTrailingSlash(this.settings.todoApiUri) + 'items';
    return this.httpClient.put(apiEndpoint, dtos).pipe(
      catchError((err) => this.errorHandler.handleError(err))
    );
  }
}
