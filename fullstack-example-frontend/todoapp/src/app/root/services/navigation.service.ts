import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Event, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ITodoNavigator, TodoNavigator } from 'src/app/todo';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements ITodoNavigator  {
  private routingHistory: string[] = [];
  private events = new ReplaySubject<Event>(1);

  constructor(
    private location: Location,
    private router: Router
    ) {
      this.router.events.pipe(
        tap((event) => this.events.next(event))
      ).subscribe();
  }
  public navigateToMatrixView(matrixKindId: string, extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToMatrixView(this.router, [], matrixKindId, extras);
  }
  public navigateToMatrixViewToday(extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToMatrixViewToday(this.router, [], extras);
  }
  public navigateToMatrixViewUpcoming(extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToMatrixViewUpcoming(this.router, [], extras);
  }
  public navigateToMatrixViewAll(extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToMatrixViewAll(this.router, [], extras);
  }
  public navigateToListView(listKindId: string, extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToListView(this.router, [], listKindId, extras);
  }
  public navigateToListEditor(listId: string, extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToListEditor(this.router, [], listId, extras);
  }
  public navigateToListCreationEditor(extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToListCreationEditor(this.router, [], extras);
  }
  public navigateToTaskEditor(taskId: string, extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToTaskEditor(this.router, [], taskId, extras);
  }
  public navigateToTaskCreationEditor(extras?: NavigationExtras): Promise<boolean> {
    return TodoNavigator.navigateToTaskCreationEditor(this.router, [], extras);
  }

  public isSidenavActive(sidebar?: string):  boolean {
    return TodoNavigator.isSidenavActive(this.router, sidebar);
  }

  public get navigationEndEvents(): Observable<NavigationEnd> {
    return TodoNavigator.navigationEndEvents(this.events);
  }

  public switchSidebarOn(): Promise<boolean> {
    return TodoNavigator.switchSidebarOn(this.router, []);
  }

  public trackHistory(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe({
      next: (event) => {
        this.routingHistory.push((event as NavigationEnd).urlAfterRedirects);
      }
    });
  }

  public navigate(commands: any[], extras?: NavigationExtras | undefined): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  public back(): Promise<boolean> {
    this.routingHistory.pop();
    if (this.routingHistory.length > 0) {
      return new Promise((resolve, reject) => {
        this.location.back();
        resolve(true);
      });
    } else {
      return this.router.navigateByUrl('/');
    }
  }
}
