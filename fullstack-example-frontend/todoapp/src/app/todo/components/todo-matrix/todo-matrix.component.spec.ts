import { MatMenuModule } from '@angular/material/menu';
import { MATRIX_KIND } from './../../matrix-kind';
import { TODO_MATRIX_KIND_ID } from './../../todo-routing-path';
import { TodoDataService } from 'src/app/common/data';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TodoMatrixComponent } from './todo-matrix.component';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';
import { MatrixX, MatrixY, TodoItem } from 'src/app/common/models';
import { DateTime } from 'luxon';
import { getToday } from 'src/app/common/date-utility';
import { Input, Component, Output, EventEmitter, Directive, HostListener, DebugElement } from '@angular/core';
import { TodoQuadrantItem } from '../todo-matrix-quadrant/todo-quadrant-item';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: '',
  selector: 'app-todo-matrix-quadrant'
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TodoMatrixQuadrantComponentStub {  
  @Input() public items: TodoQuadrantItem[] | undefined;
  @Output() public edited = new EventEmitter<TodoQuadrantItem>();
  @Output() public marked = new EventEmitter<TodoQuadrantItem[]>();
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class RouterLinkDirectiveStub {
  @Input() queryParams: any;
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}

function getDebugElemsAndRouterLinks(fixture: ComponentFixture<TodoMatrixComponent>): [DebugElement[], RouterLinkDirectiveStub[]] {
  const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  return [linkDes, routerLinks];
}


describe('TodoMatrixComponent', () => {
  let component: TodoMatrixComponent;
  let fixture: ComponentFixture<TodoMatrixComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let todoDataServiceFake: FakeTodoService;
  let todoDataService: TodoDataService;
  let activatedRouteStub: ActivatedRouteStub;
  let loader: HarnessLoader;

  function initComponent(item: TodoItem[] = [], matrixKindId = MATRIX_KIND.ALL): void {
    const todoItems: TodoItem[] = [...item];
    const item1 = new TodoItem('id1', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 1', MatrixX.Urgent, MatrixY.Important, "Note 1", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const item2 = new TodoItem('id2', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 2', MatrixX.Urgent, MatrixY.Important, "Note 2", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const itemDueToday = new TodoItem('id3', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 3', MatrixX.Urgent, MatrixY.Important, "Note 3", getToday(),  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    todoItems.push(item1);
    todoItems.push(item2);
    todoItems.push(itemDueToday);
    todoDataServiceFake.setGetTodoItems(todoItems);
    const params: Params = {};
    params[TODO_MATRIX_KIND_ID] = matrixKindId;
    activatedRouteStub.setParamMap(params);
    fixture.detectChanges();
    tick();
  }

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    activatedRouteStub = new ActivatedRouteStub();
    todoDataServiceFake = new FakeTodoService(); 
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
      ],
      declarations: [
        RouterLinkDirectiveStub,
        TodoMatrixQuadrantComponentStub,
        TodoMatrixComponent 
      ],
      providers: [
        { provide: TodoDataService, useValue: todoDataServiceFake },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoMatrixComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoDataService = TestBed.inject(TodoDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only display items with a due date of either today or null if the route matrix param is today.', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);
    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

    expect(component.itemsImportantAndUrgent.length).toEqual(3);
    expect(quadrantComponents[0].items?.length).toEqual(3);
    expect(quadrantComponents[1].items?.length).toEqual(0);
    expect(quadrantComponents[2].items?.length).toEqual(0);
    expect(quadrantComponents[3].items?.length).toEqual(0);
  }));

  it('should only display items with a due date of either greater than today or null if the route matrix param is upcoming.', fakeAsync(() => {
    const now = DateTime.now();
    const upcomingDueDate = DateTime.utc(now.year + 1, now.month, now.day);
    const itemDueToday = new TodoItem('id4', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 4', MatrixX.NotUrgent, MatrixY.Important, "Note 4", upcomingDueDate,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    initComponent([itemDueToday], MATRIX_KIND.UPCOMING);

    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

    expect(component.itemsImportantAndUrgent.length).toEqual(2);
    expect(quadrantComponents[0].items?.length).toEqual(2);
    expect(component.itemsImportantAndNotUrgent.length).toEqual(1);
    expect(quadrantComponents[1].items?.length).toEqual(1);
    expect(quadrantComponents[2].items?.length).toEqual(0);
    expect(quadrantComponents[3].items?.length).toEqual(0);
  }));

  it('should only display all items if the route matrix param is all.', fakeAsync(() => {
    const now = DateTime.now();
    const upcomingDueDate = DateTime.utc(now.year + 1, now.month, now.day);
    const itemDueToday = new TodoItem('id4', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 4', MatrixX.NotUrgent, MatrixY.Important, "Note 4", upcomingDueDate,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    initComponent([itemDueToday], MATRIX_KIND.ALL);

    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

    expect(component.itemsImportantAndUrgent.length).toEqual(3);
    expect(quadrantComponents[0].items?.length).toEqual(3);
    expect(component.itemsImportantAndNotUrgent.length).toEqual(1);
    expect(quadrantComponents[1].items?.length).toEqual(1);
    expect(quadrantComponents[2].items?.length).toEqual(0);
    expect(quadrantComponents[3].items?.length).toEqual(0);
  }));

  it('should destroy all subscriptions on component destruction', fakeAsync(() => {
    initComponent();

    // simulate destroy
    component.ngOnDestroy();

    expect(component.itemsImportantAndUrgent.length).toEqual(3);
    // trigger new
    const itemDueToday = new TodoItem('id5', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 5', MatrixX.Urgent, MatrixY.Important, "Note 5", getToday(),  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    initComponent([itemDueToday], MATRIX_KIND.TODAY);
    // assert: items should stay untouched, since subscription didn't push new values because of the unsubscribe
    expect(component.itemsImportantAndUrgent.length).toEqual(3);
  }));

  it('should be able to edit an quadrant item by navigating to the editor.', fakeAsync(() => {
    initComponent();
    
    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));
    
    quadrantComponents[0].edited.emit(quadrantComponents[0].items?.[0]);
    
    expect(router.navigate).toHaveBeenCalledWith(['/tasks/', 'id1'], { relativeTo: activatedRoute });
  }));

  it('should be able to collect selected quadrant items for bulk actions.', fakeAsync(() => {
    initComponent();

    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

 
    quadrantComponents[0].marked.emit([quadrantComponents[0].items?.[1] as TodoQuadrantItem]);

    expect(component.selectedItemsMap.size).toEqual(1);
  }));

  it('should be able to deselect quadrant items for bulk actions.', fakeAsync(() => {
    initComponent();

    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

    quadrantComponents[0].marked.emit([quadrantComponents[0].items?.[1] as TodoQuadrantItem]);

    expect(component.selectedItemsMap.size).toEqual(1);

    quadrantComponents[0].marked.emit([quadrantComponents[0].items?.[1] as TodoQuadrantItem]);

    expect(component.selectedItemsMap.size).toEqual(0);
  }));

  it('should be able to use marked quadrant items for action - "mark selected as done".', fakeAsync(async () => {
    const markAsDoneSpy = spyOn(todoDataService, 'markAsDone').and.callThrough();
    initComponent();

    // arrange by selecting some quadrant items to be marked as done
    const quadrantsDes = fixture.debugElement.queryAll(By.directive(TodoMatrixQuadrantComponentStub));
    const quadrantComponents = quadrantsDes.map(de => de.injector.get(TodoMatrixQuadrantComponentStub));

    quadrantComponents[0].marked.emit([quadrantComponents[0].items?.[0] as TodoQuadrantItem, quadrantComponents[0].items?.[1] as TodoQuadrantItem]);

    // act
    const matMenuHarnesses = await loader.getAllHarnesses(MatMenuHarness.with({ triggerText: 'more' }));    
    const matMenu1stQuadrant = matMenuHarnesses[0];
    await matMenu1stQuadrant.open();
    const markAsDoneMenuItemHarnesses = await matMenu1stQuadrant.getItems({text: 'Mark selected as done'});
    await markAsDoneMenuItemHarnesses[0].click();

    // assert
    expect(markAsDoneSpy).toHaveBeenCalledWith([(quadrantComponents[0].items?.[0] as TodoQuadrantItem).id, (quadrantComponents[0].items?.[1] as TodoQuadrantItem).id]);

  }));

  it('should navigate to a list of items for a particular matrix kind with coordinates as query params by clicking the quadrant name: matrix kind today - quadrant 1', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);

    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElemOfQuadrant1 = debugElemAndRouterLinks[0][0];
    const linkOfQuadrant1 = debugElemAndRouterLinks[1][0];

    linkDebugElemOfQuadrant1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(linkOfQuadrant1.navigatedTo).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.linkParams).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.queryParams).toEqual({ matrixY: MatrixY.Important, matrixX: MatrixX.Urgent});
    
  }));

  it('should navigate to a list of items for a particular matrix kind with coordinates as query params by clicking the quadrant name: matrix kind today - quadrant 2', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);

    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElemOfQuadrant1 = debugElemAndRouterLinks[0][0];
    const linkOfQuadrant1 = debugElemAndRouterLinks[1][0];

    linkDebugElemOfQuadrant1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(linkOfQuadrant1.navigatedTo).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.linkParams).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.queryParams).toEqual({ matrixY: MatrixY.Important, matrixX: MatrixX.Urgent});
    
  }));

  it('should navigate to a list of items for a particular matrix kind with coordinates as query params by clicking the quadrant name: matrix kind today - quadrant 3', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);

    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElemOfQuadrant1 = debugElemAndRouterLinks[0][1];
    const linkOfQuadrant1 = debugElemAndRouterLinks[1][1];

    linkDebugElemOfQuadrant1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(linkOfQuadrant1.navigatedTo).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.linkParams).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.queryParams).toEqual({ matrixY: MatrixY.Important, matrixX: MatrixX.NotUrgent});
    
  }));

  it('should navigate to a list of items for a particular matrix kind with coordinates as query params by clicking the quadrant name: matrix kind today - quadrant 4', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);

    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElemOfQuadrant1 = debugElemAndRouterLinks[0][2];
    const linkOfQuadrant1 = debugElemAndRouterLinks[1][2];

    linkDebugElemOfQuadrant1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(linkOfQuadrant1.navigatedTo).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.linkParams).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.queryParams).toEqual({ matrixY: MatrixY.NotImportant, matrixX: MatrixX.Urgent});
    
  }));

  it('should navigate to a list of items for a particular matrix kind with coordinates as query params by clicking the quadrant name: matrix kind today - quadrant 4', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);

    const debugElemAndRouterLinks = getDebugElemsAndRouterLinks(fixture);
    const linkDebugElemOfQuadrant1 = debugElemAndRouterLinks[0][3];
    const linkOfQuadrant1 = debugElemAndRouterLinks[1][3];

    linkDebugElemOfQuadrant1.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(linkOfQuadrant1.navigatedTo).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.linkParams).toEqual(['', 'list-view', component.id]);
    expect(linkOfQuadrant1.queryParams).toEqual({ matrixY: MatrixY.NotImportant, matrixX: MatrixX.NotUrgent});
    
  }));

  it('should offer a menu with actions next to the quadrant name', fakeAsync( async () => {
    initComponent([], MATRIX_KIND.TODAY);

    const menuButtonHarnesses = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'more'}));

    expect(menuButtonHarnesses.length).toEqual(4);
  })); 

});
