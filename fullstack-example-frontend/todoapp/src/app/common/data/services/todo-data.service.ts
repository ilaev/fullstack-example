import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { TodoList } from 'src/app/common/models';


const INITIAL_MOCK_DATA: TodoList[] = [
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#e91e63'),
  new TodoList('d227c8e8-7aa8-4b7b-8782-644f87de5b98', 'Project Z', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#ffc107')
];

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  // TODO: tmp until there is a solution for client side storage or server side persistence 
  private listsSubject: BehaviorSubject<TodoList[]> = new BehaviorSubject<TodoList[]>(INITIAL_MOCK_DATA);
  constructor() { }

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
    const listWithId = new TodoList((currentLists.length + 1).toString(), list.name, list.description, list.createdAt, list.modifiedAt, list.deletedAt, list.color);
    const newLists = currentLists.concat([list]);
    this.listsSubject.next(newLists);
    return of(listWithId);
  }
}
