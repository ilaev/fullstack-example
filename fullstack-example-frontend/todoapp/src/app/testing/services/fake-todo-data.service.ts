import { TodoList, TodoItem } from 'src/app/common/models';
import { ReplaySubject, Observable, EMPTY, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export class FakeTodoService {
  public getTodoItemReturnValue = new ReplaySubject<TodoItem | undefined>();
  public setTodoItemReturnValue: Observable<TodoItem> = EMPTY;
  public getListReturnValue: ReplaySubject<TodoList | undefined> = new ReplaySubject<TodoList | undefined>(1);
  public setListReturnValue: Observable<TodoList> = EMPTY;
  public getTodoItemsReturnValue = new ReplaySubject<TodoItem[]>();
  public markAsDoneReturnValue = new ReplaySubject<TodoItem[]>(1);

  private listsSubject: ReplaySubject<TodoList[]> = new ReplaySubject<TodoList[]>(1);
  
  public getList(id: string): Observable<TodoList | undefined> {
    return this.getListReturnValue.asObservable();
  }

  public getLists(): Observable<TodoList[]> {
    return this.listsSubject.asObservable();
  }

  public getTodoItem(id: string):  Observable<TodoItem | undefined> {
    return this.getTodoItemReturnValue.asObservable();
  }

  public getTodoItems(): Observable<TodoItem[]> {
    return this.getTodoItemsReturnValue.asObservable();
  }

  public getTodoItemsByListId(listId: string): Observable<TodoItem[]> {
    return this.getTodoItems().pipe(map(items => items.filter(i => i.listId === listId)));
  }

  public setTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.setTodoItemReturnValue;
  }

  public setList(todoList: any): Observable<TodoList> {
    return this.setListReturnValue;
  }

  public markAsDone(ids: string[]): Observable<TodoItem[]> {
    return this.markAsDoneReturnValue.asObservable();
  }

  // only in fake
  public setGetTodoItems(items: TodoItem[]): void {
    return this.getTodoItemsReturnValue.next(items);
  }
  // only in fake
  public setGetTodoItemReturnValue(todoItem: TodoItem | undefined): void {
    this.getTodoItemReturnValue.next(todoItem);
  }
  // only in fake
  public setGetListReturnValue(list: TodoList | undefined): void {
    this.getListReturnValue.next(list);
  }
  public setGetLists(todoLists: TodoList[]): void {
    this.listsSubject.next(todoLists);
  }  

}