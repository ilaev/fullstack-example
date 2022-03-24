import { ITodoDataService } from './../interfaces/i-todo-data-service';
import { map, switchMap, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { TodoItem, TodoList, TodoStats } from 'src/app/common/models';
import { getToday } from '../../date-utility';
import { TodoApiService, UserApiService } from '../../api';
import { transformFromTodoListDTO, transformToTodoListDTO } from '../transform/transform-todo-list-dto';
import { transformFromTodoItemDTO, transformToTodoItemDTO } from '../transform/transform-todo-item-dto';

// TODO: interface since I need to be able to replace this service based on environment configuration 
// so that I can host it without the backend. 
@Injectable({
  providedIn: 'root'
})
export class TodoDataService implements ITodoDataService {
  private listsSubject: ReplaySubject<TodoList[]> | null = null;
  private todoItemsSubject: ReplaySubject<TodoItem[]> | null = null;
 
  constructor(
      private todoApiService: TodoApiService,
      private userApiService: UserApiService
  ) {}

  private loadItems(): Observable<TodoItem[]> {
    if (this.todoItemsSubject == null)
      this.todoItemsSubject = new ReplaySubject<TodoItem[]>(1);
    // maybe load the items through the lists.
    return this.userApiService.getItemsOfCurrentUser().pipe(
      switchMap((itemsDtos: any[]) => {
        (this.todoItemsSubject as ReplaySubject<TodoItem[]>).next(itemsDtos.map(itemDto => transformFromTodoItemDTO(itemDto)));
        return (this.todoItemsSubject as ReplaySubject<TodoItem[]>).asObservable();
      })
    );
  }
  public getTodoItems(): Observable<TodoItem[]> {
    if (this.todoItemsSubject === null) {
      return this.loadItems();
    } else {
      return this.todoItemsSubject.asObservable();
    }
  }

  public getTodoItem(id: string): Observable<TodoItem | undefined> {
    return this.getTodoItems().pipe(
      map(todoItems => {
        return todoItems.find(ti => ti.id === id);
      })
    );
  }

  public getTodoItemsByListId(listId: string): Observable<TodoItem[]> {
    return this.getTodoItems().pipe(
      map((items) => {
        return items.filter(i => i.listId === listId);
      })
    );
  }

  public getTodoStats(): Observable<TodoStats> {
    return this.getTodoItems().pipe(
      map((items) => {
        const todoItemsDueDateGreaterThanOrEqualToToday = items.filter(i => {
          return i.dueDate ? i.dueDate >= getToday() : true;  

        });
        const numberOfItemsMarkedAsDone = todoItemsDueDateGreaterThanOrEqualToToday.reduce((prevValue, currentItem, index) => {
          return currentItem.markedAsDone ? prevValue + 1 : prevValue + 0;
        }, 0);
        return new TodoStats(numberOfItemsMarkedAsDone, todoItemsDueDateGreaterThanOrEqualToToday.length);
      })
    );
  }

  public setTodoItem(todoItem: TodoItem): Observable<void> {
    const isNewItem = todoItem.id === '';
    if (isNewItem) {
      return this.todoApiService.createItems([transformToTodoItemDTO(todoItem)]).pipe(
        switchMap(() => {
          return combineLatest([this.loadLists(), this.loadItems()]).pipe(map(() => { return; }));
        }));
    } else {
      return this.todoApiService.updateItems([transformToTodoItemDTO(todoItem)]).pipe(
        switchMap(() => {
          return combineLatest([this.loadLists(), this.loadItems()]).pipe(map(() => { return; }));
        }));
    }
  }

  public updateTodoItems(todoItems: TodoItem[]): Observable<TodoItem[]> {
    return this.todoApiService.updateItems(todoItems.map(item => transformToTodoItemDTO(item))).pipe(
      switchMap(() => {
        return this.loadItems();
      })
    );
  }

  public changeDoneStatusOfItems(mapOfChanges: { [key: string]: boolean }): Observable<TodoItem[]> {
    return this.getTodoItems().pipe(
      first(),
      switchMap((items) => {
        const keys = Object.keys(mapOfChanges);
        const affectedItems: TodoItem[] = [];
        for (let i = 0; i < keys.length; i++) {
          const currentItem = items.find(item => item.id === keys[i]);
          if (currentItem) {
            currentItem.markedAsDone = mapOfChanges[keys[i]];
            affectedItems.push(currentItem);
          }
        }
        return this.updateTodoItems(affectedItems);
      })
    );
  }
  
  private loadLists(): Observable<TodoList[]> {
    if (this.listsSubject == null)
      this.listsSubject = new ReplaySubject<TodoList[]>(1);
    return this.userApiService.getListsOfCurrentUser().pipe(
      switchMap((listDtos: any[]) => {
          (this.listsSubject as ReplaySubject<TodoList[]>).next(listDtos.map((dto) => transformFromTodoListDTO(dto)));
          return (this.listsSubject as ReplaySubject<TodoList[]>).asObservable();
      }));
  }

  public getLists(): Observable<TodoList[]> {
    if (this.listsSubject === null) {
      return this.loadLists();
    } else {
      return this.listsSubject.asObservable();
    }
    
  }

  public getList(id: string): Observable<TodoList | undefined> {
    return this.getLists().pipe(
      map((lists) => {
        return lists.find(l => l.id == id);
      })
    );
  }

  public setList(list: TodoList): Observable<void> {
    const isNewList = list.id === '';
    if (isNewList) {
        return this.todoApiService.createLists([transformToTodoListDTO(list)])
          .pipe(
            switchMap(() => {
              return this.loadLists().pipe(map(() => { return; }));
            }));
    } else {
      return this.todoApiService.updateLists([transformToTodoListDTO(list)])
        .pipe(
          switchMap(() => {
            return this.loadLists().pipe(map(() => { return; }));
          }));
    }
  }
}