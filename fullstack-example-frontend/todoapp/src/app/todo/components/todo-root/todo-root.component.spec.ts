import { Observable, ReplaySubject } from 'rxjs';
import { ITodoNavigator, TODO_NAVIGATOR_TOKEN } from 'src/app/todo';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TodoRootComponent } from './todo-root.component';
import { NavigationEnd } from '@angular/router';

class FakeTodoNavigator {
  private subjectNavigationEndEvents = new ReplaySubject<NavigationEnd>(1);
  private returnValueIsSidenavActive = false;
  public get navigationEndEvents(): Observable<NavigationEnd> {
    return this.subjectNavigationEndEvents.asObservable();
  }

  public setNavigationEndEvent(val: NavigationEnd): void {
    this.subjectNavigationEndEvents.next(val);
  }

  isSidenavActive(): boolean {
    return this.returnValueIsSidenavActive;
  }

  public setIsSidenavActive(val: boolean): void {
    this.returnValueIsSidenavActive = val;
  }

  public switchSidebarOn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

}

describe('TodoRootComponent', () => {
  let component: TodoRootComponent;
  let fixture: ComponentFixture<TodoRootComponent>;
  let fakeTodoNavigator: FakeTodoNavigator;

  let navigator: ITodoNavigator;

  beforeEach(async () => {
    fakeTodoNavigator = new FakeTodoNavigator();
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: TODO_NAVIGATOR_TOKEN, useValue: fakeTodoNavigator }
      ],
      declarations: [ TodoRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoRootComponent);
    component = fixture.componentInstance;
    navigator = TestBed.inject(TODO_NAVIGATOR_TOKEN);
  
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should enable sidenav if it\'s disabled', fakeAsync(() => {
    const spySwitchSidebarOn = spyOn(navigator, 'switchSidebarOn');
    fakeTodoNavigator.setNavigationEndEvent(new NavigationEnd(1, '', ''));
    tick();
    fixture.detectChanges();
    expect(spySwitchSidebarOn).toHaveBeenCalled();
  }));
});
