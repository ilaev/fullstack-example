import { Observable } from 'rxjs';
import { TodoList, TodoItem, TodoStats } from 'src/app/common/models';
export interface ITodoDataService {
    getTodoItems(): Observable<TodoItem[]>;
    getTodoItem(id: string): Observable<TodoItem | undefined>;
    getTodoItemsByListId(listId: string): Observable<TodoItem[]>;
    getTodoStats(): Observable<TodoStats>;
    setTodoItem(todoItem: TodoItem): Observable<void>;
    changeDoneStatusOfItems(mapOfChanges: { [key: string]: boolean }): Observable<TodoItem[]>;
    getLists(): Observable<TodoList[]>;
    getList(id: string): Observable<TodoList | undefined>;
    setList(list: TodoList): Observable<void>;
}