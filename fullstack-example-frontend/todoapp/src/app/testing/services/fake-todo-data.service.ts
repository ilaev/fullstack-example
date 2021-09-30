import { TodoList, TodoItem } from 'src/app/common/models';
import { ReplaySubject, Observable, EMPTY, of, throwError } from 'rxjs';

export class FakeTodoService {
  public getTodoItemReturnValue = new ReplaySubject<TodoItem | undefined>();
  public setTodoItemReturnValue: Observable<TodoItem> = EMPTY;
  public getListReturnValue: ReplaySubject<TodoList | undefined> = new ReplaySubject<TodoList | undefined>(1);
  public setListReturnValue: Observable<TodoList> = EMPTY;

  private listsSubject: ReplaySubject<TodoList[]> = new ReplaySubject<TodoList[]>(1);
  
  public getList(id: string): Observable<TodoList | undefined> {
    return this.getListReturnValue.asObservable();
  }

  public getLists(): Observable<TodoList[]> {
    return this.listsSubject.asObservable();
  }
  
  public setGetLists(todoLists: TodoList[]): void {
    this.listsSubject.next(todoLists);
  }

  public getTodoItem(id: string):  Observable<TodoItem | undefined> {
    return this.getTodoItemReturnValue.asObservable();
  }

  public setTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.setTodoItemReturnValue;
  }

  public setGetTodoItemReturnValue(todoItem: TodoItem | undefined): void {
    this.getTodoItemReturnValue.next(todoItem);
  }

  public setGetListReturnValue(list: TodoList | undefined): void {
    this.getListReturnValue.next(list);
  }

  public setList(todoList: any): Observable<TodoList> {
    return this.setListReturnValue;
  }

}