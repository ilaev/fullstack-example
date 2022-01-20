import { throwError } from 'rxjs';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TodoDataService } from 'src/app/common/data';
import { ReplaySubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, DebugElement, Directive, HostListener, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { TodoList, TodoStats } from 'src/app/common/models';
import { rgb2hex } from 'src/app/common/color-utility';
import { DateTime } from 'luxon';
import { FakeTodoService } from 'src/app/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';


@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MatrixComponentStub { }

@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TodoRootComponentStub { }

const routes: Routes = [
  {
    path: '',
    component: TodoRootComponentStub,
    children: [
      {
        path: 'matrix/:id',
        component: MatrixComponentStub
      }
    ]
  },

];

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}




function getDebugElemsAndRouterLinks(fixture: ComponentFixture<SidenavComponent>): [DebugElement[], RouterLinkDirectiveStub[]] {
  const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  return [linkDes, routerLinks];
}

const INITIAL_MOCK_DATA: TodoList[] = [
  new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
  new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
  new TodoList('d227c8e8-7aa8-4b7b-8782-644f87de5b98', 'Project Z', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#ffc107')
];

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: Router;
  let loader: HarnessLoader;
  let todoDataService: TodoDataService;
  let toastr: ToastrService;

  let fakeTodoDataService: FakeTodoService;
  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    fakeTodoDataService = new FakeTodoService();
    fakeTodoDataService.setGetLists(INITIAL_MOCK_DATA);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatProgressSpinnerModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule
      ],
      declarations: [
        RouterLinkDirectiveStub,
        TodoRootComponentStub,
        MatrixComponentStub,
        SidenavComponent
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TodoDataService, useValue: fakeTodoDataService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    todoDataService = TestBed.inject(TodoDataService);
    toastr = TestBed.inject(ToastrService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display progress.', fakeAsync(() => {
    fakeTodoDataService.setGetTodoStats(new TodoStats(2, 4));
    fixture.detectChanges();
    tick();
    const progressContentElem = fixture.nativeElement.querySelector('.progress-container div') as HTMLElement;
    expect(progressContentElem.innerText).toEqual('2 / 4');
  }));

  it('should display progress spinner.', fakeAsync(async () => {
    const stats = new TodoStats(2, 4);
    fakeTodoDataService.setGetTodoStats(stats);
    fixture.detectChanges();
    tick();

    const matProgressHarness = await loader.getHarness(MatProgressSpinnerHarness.with({selector: 'mat-progress-spinner'}));
    const matProgressValue = await matProgressHarness.getValue();

    expect(matProgressValue).toEqual(stats.numberOfItemsMarkedAsDonePercentage);
  }));

  it('should show an error if user\'s todo stats can\'t be loaded.', fakeAsync(() => {
    spyOn(todoDataService, 'getTodoStats').and.returnValue(throwError('mock error'));

    fixture.detectChanges(); // ngOnInit

    expect(toastr.error).toHaveBeenCalledWith('Ops, Sorry! Something went wrong. Could not load todo stats.');
  }));

  it('should have a redirect to today matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][0];
    expect(link.linkParams).toEqual(['', 'matrix', 'today']);
  });

  it('should open today matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][0];
    const link = debugElemAndRouterLinks[1][0];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'today']);
  });

  it('should have a redirect to upcoming matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][1];
    expect(link.linkParams).toEqual(['', 'matrix', 'upcoming']);
  });

  it('should open upcoming matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][1];
    const link = debugElemAndRouterLinks[1][1];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'upcoming']);
  });

  it('should have a redirect to all matrix view.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][2];
    expect(link.linkParams).toEqual(['', 'matrix', 'all']);
  });

  it('should open all matrix view.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][2];
    const link = debugElemAndRouterLinks[1][2];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', 'all']);
  });

  it('should highlight active route', fakeAsync(() => {
    fixture.detectChanges();
    router.navigate(['', 'matrix', 'today']);
    tick();
    let activeLinks = fixture.debugElement.queryAll(By.css('.active-nav-item')).map(element => element.injector.get(RouterLinkDirectiveStub));
    expect(activeLinks.length).toBe(1, 'should only have 1 active link');
    expect(activeLinks[0].linkParams).toEqual(['', 'matrix', 'today'], 'active link should be for Home');

    router.navigate(['', 'matrix', 'upcoming']);

    tick();
    activeLinks = fixture.debugElement.queryAll(By.css('.active-nav-item')).map(element => element.injector.get(RouterLinkDirectiveStub));
    expect(activeLinks.length).toBe(1, 'should only have 1 active link');
    expect(activeLinks[0].linkParams).toEqual(['', 'matrix', 'upcoming'], 'active link should be for Home');
  }));

  it('should display user\'s todo lists.', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const link1 = getDebugElemsAndRouterLinks(fixture)[1][3];
    const link2 = getDebugElemsAndRouterLinks(fixture)[1][4];
    const link3 = getDebugElemsAndRouterLinks(fixture)[1][5];
    expect(link1.linkParams).toEqual(['', 'matrix', INITIAL_MOCK_DATA[0].id]);
    expect(link2.linkParams).toEqual(['', 'matrix', INITIAL_MOCK_DATA[1].id]);
    expect(link3.linkParams).toEqual(['', 'matrix', INITIAL_MOCK_DATA[2].id]);
  }));

  it('should show an error if user\'s todo lists can\'t be loaded.', fakeAsync(() => {
    spyOn(todoDataService, 'getLists').and.returnValue(throwError('mock error'));

    fixture.detectChanges(); // ngOnInit

    expect(toastr.error).toHaveBeenCalledWith('Ops, Sorry! Something went wrong. Could not load todo lists.');
  }));

  it('should be able to open user\'s list matrix view.', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][3];
    const link = debugElemAndRouterLinks[1][3];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'matrix', INITIAL_MOCK_DATA[0].id]);
  }));

  it('should display user\'s todo list color', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const iconElems = fixture.debugElement.queryAll(By.css('.list-container mat-icon'));

    expect(rgb2hex(iconElems[0].styles['color'] as string)).toEqual(INITIAL_MOCK_DATA[0].color);
    expect(rgb2hex(iconElems[1].styles['color'] as string)).toEqual(INITIAL_MOCK_DATA[1].color);
    expect(rgb2hex(iconElems[2].styles['color'] as string)).toEqual(INITIAL_MOCK_DATA[2].color);
  }));

  it('should have a redirect to add new todo lists.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][6];
    expect(link.linkParams).toEqual(['', 'lists', 'new']);
  });

  it('should open create new todo lists dialog.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][6];
    const link = debugElemAndRouterLinks[1][6];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'lists', 'new']);
  });

  it('should have a redirect to add new tasks.', () => {
    fixture.detectChanges();
    const link = getDebugElemsAndRouterLinks(fixture)[1][7];
    expect(link.linkParams).toEqual(['', 'tasks', 'new']);
  });

  it('should open create new tasks dialog.', () => {
    fixture.detectChanges();
    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElem = debugElemAndRouterLinks[0][7];
    const link = debugElemAndRouterLinks[1][7];

    expect(link.navigatedTo).toBeNull('should not have navigated yet');

    linkDebugElem.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(link.navigatedTo).toEqual(['', 'tasks', 'new']);
  });

});
