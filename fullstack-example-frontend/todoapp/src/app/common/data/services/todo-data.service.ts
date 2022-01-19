import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { MatrixX, MatrixY, TodoItem, TodoList, TodoStats } from 'src/app/common/models';
import { DateTime } from 'luxon';
import { getToday } from '../../date-utility';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_MOCK_DATA: TodoList[] = [
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('d227c8e8-7aa8-4b7b-8782-644f87de5b98', 'Project Z', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#ffc107')
];

const INITIAL_MOCK_TODO_ITEM_DATA: TodoItem[] = [
  new TodoItem('id1', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 1', MatrixX.Urgent, MatrixY.Important, "Note 1", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, true),
  new TodoItem('id2', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 2', MatrixX.Urgent, MatrixY.NotImportant, "Note 2", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
  new TodoItem('id3', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 3', MatrixX.NotUrgent, MatrixY.Important, "Note 3", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
  new TodoItem('id4', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 4', MatrixX.NotUrgent, MatrixY.NotImportant, "Note 4", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),

  new TodoItem('id5', '15ed938b-ec9b-49ec-8575-5c721eff6639', 'Task 5', MatrixX.Urgent, MatrixY.Important, "Note 5", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
  new TodoItem('id6', '15ed938b-ec9b-49ec-8575-5c721eff6639', 'Task 6', MatrixX.Urgent, MatrixY.NotImportant, "Note 6", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
  new TodoItem('id7', '15ed938b-ec9b-49ec-8575-5c721eff6639', 'Task 7', MatrixX.NotUrgent, MatrixY.Important, "Note 7", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
  new TodoItem('id8', '15ed938b-ec9b-49ec-8575-5c721eff6639', 'Task 8', MatrixX.NotUrgent, MatrixY.NotImportant, "Note 8", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false),
];

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  // TODO: tmp until there is a solution for client side storage or server side persistence 
  private listsSubject: BehaviorSubject<TodoList[]> = new BehaviorSubject<TodoList[]>(INITIAL_MOCK_DATA);
  private todoItemsSubject: BehaviorSubject<TodoItem[]> = new BehaviorSubject<TodoItem[]>(INITIAL_MOCK_TODO_ITEM_DATA);


  public getTodoItems(): Observable<TodoItem[]> {
    return this.todoItemsSubject.asObservable();
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

  public setTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    const currentItems = this.todoItemsSubject.getValue();
    const foundItemIndex = currentItems.findIndex(i => i.id === todoItem.id);
    if (foundItemIndex === -1) {
      const itemToAdd = new TodoItem(uuidv4(), todoItem.listId, todoItem.name, todoItem.matrixX, todoItem.matrixY, todoItem.note, todoItem.dueDate, todoItem.createdAt, todoItem.modifiedAt, todoItem.deletedAt, todoItem.markedAsDone);
      const newTodoItemList = currentItems.concat([itemToAdd]);
      this.todoItemsSubject.next(newTodoItemList);
      return of(itemToAdd);
    } else {
      currentItems[foundItemIndex] = todoItem;
      this.todoItemsSubject.next(currentItems);
      return of(todoItem);
    }
  }

  public setTodoItems(todoItems: TodoItem[]): Observable<TodoItem[]> {
    const currentItems = this.todoItemsSubject.getValue();
    const itemsToAdd: TodoItem[] = [];

    todoItems.forEach(todoItem => {
      const foundItemIndex = currentItems.findIndex(i => i.id === todoItem.id);
      if (foundItemIndex === -1) {
        const itemToAdd = new TodoItem((currentItems.length + 1).toString(), todoItem.listId, todoItem.name, todoItem.matrixX, todoItem.matrixY, todoItem.note, todoItem.dueDate, todoItem.createdAt, todoItem.modifiedAt, todoItem.deletedAt, todoItem.markedAsDone);
        itemsToAdd.push(itemToAdd);
      } else {
        currentItems[foundItemIndex] = todoItem;
      }
    });

    if (itemsToAdd.length > 0) {
      this.todoItemsSubject.next(currentItems.concat(itemsToAdd));
    } else {
      this.todoItemsSubject.next(currentItems);
    }
    return of(itemsToAdd);
  }

  public changeDoneStatusOfItems(mapOfChanges: { [key: string]: boolean }): Observable<TodoItem[]> {
    const currentItems = this.todoItemsSubject.getValue();
    const affectedItems: TodoItem[] = [];
    const keys = Object.keys(mapOfChanges);
    for (let i = 0; i < keys.length; i++) {
      const currentItem = currentItems.find(item => item.id === keys[i]);
      if (currentItem) {
        currentItem.markedAsDone = mapOfChanges[keys[i]];
        affectedItems.push(currentItem);
      }
    }

    return this.setTodoItems(affectedItems);
  }

  public getLists(): Observable<TodoList[]> {
    return this.listsSubject.asObservable();
  }

  public getList(id: string): Observable<TodoList | undefined> {
    return this.listsSubject.asObservable().pipe(
      map((lists) => {
        return lists.find(l => l.id == id);
      })
    );
  }

  public setList(list: TodoList): Observable<TodoList> {
    const currentLists = this.listsSubject.getValue();
    const foundIndex = currentLists.findIndex(l => l.id === list.id);
    if (foundIndex === -1) {
      const newList = new TodoList(uuidv4(), list.name, list.description, list.createdAt, list.modifiedAt, list.deletedAt, list.color);
      const newLists = currentLists.concat([newList]);
      this.listsSubject.next(newLists);
      return of(newList);
    } else {
      currentLists[foundIndex] = list;
      const newLists = currentLists.concat([list]);
      this.listsSubject.next(newLists);
      return of(list);
    }
  }
}
