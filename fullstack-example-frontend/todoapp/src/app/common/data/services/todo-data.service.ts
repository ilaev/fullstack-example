import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { TodoList } from 'src/app/common/models'
@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  // TODO: tmp until there is a solution for client side storage or server side persistence 
  private listsSubject: BehaviorSubject<TodoList[]> = new BehaviorSubject<TodoList[]>([]);
  constructor() { }

  public getList(id: string): Observable<TodoList | undefined> {
    return this.listsSubject.asObservable().pipe(
      map((lists) => {
        return lists.find(l => l.id == id);
      })
    )
  }

  public setList(list: TodoList): Observable<boolean> {
    const currentLists = this.listsSubject.getValue()
    const newLists = currentLists.concat([list]);
    this.listsSubject.next(newLists);
    return of(true);
  }
}
