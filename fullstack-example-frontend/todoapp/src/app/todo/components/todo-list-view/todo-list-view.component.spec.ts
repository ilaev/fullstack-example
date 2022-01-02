import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconModule } from '@angular/material/icon';
import { TODO_MATRIX_KIND_ID, TODO_QUERY_PARAM_MATRIX_X, TODO_QUERY_PARAM_MATRIX_Y } from './../../todo-routing-path';
import { MatListModule } from '@angular/material/list';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { TodoListViewComponent } from './todo-list-view.component';
import { CommonModule } from '@angular/common';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { TodoDataService } from 'src/app/common/data';
import { MatrixX, MatrixY, TodoItem, TodoList } from 'src/app/common/models';
import { DateTime } from 'luxon';
import { MATRIX_KIND } from '../../matrix-kind';
import { getToday } from 'src/app/common/date-utility';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { TodoViewListItem } from '../todo-view-list-item';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatListHarness } from '@angular/material/list/testing';
import { NavigationService } from 'src/app/root/services/navigation.service';
import { MatButtonHarness } from '@angular/material/button/testing';
@Component({
  selector: 'app-todo-list-item',
  template: '<div>{{ item?.name }}</div>'
})
export class TodoListItemStubComponent {
  @Input() item: TodoViewListItem | undefined;
  @Output() doneChanged = new EventEmitter<TodoViewListItem>();

  public triggerDoneChanged(done: boolean): void {
    if (this.item) {
      this.item.isDone = done;
      this.doneChanged.next(this.item);
    }
  }
}

fdescribe('TodoListViewComponent', () => {
  let component: TodoListViewComponent;
  let fixture: ComponentFixture<TodoListViewComponent>;
  let loader: HarnessLoader;
  let todoDataService: TodoDataService;
  let navigationService: NavigationService;

  let fakeActivatedRoute: ActivatedRouteStub;
  let fakeTodoDataService: FakeTodoService;

  beforeEach(async () => {
    fakeActivatedRoute = new ActivatedRouteStub();
    fakeTodoDataService = new FakeTodoService();
    const spyNavigationService = jasmine.createSpyObj<NavigationService>('NavigationService', ['trackHistory', 'back'])
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatListModule,
        MatIconModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: TodoDataService, useValue: fakeTodoDataService },
        { provide: NavigationService, useValue: spyNavigationService }
      ],
      declarations: [ 
        TodoListViewComponent,
        TodoListItemStubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListViewComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    todoDataService = TestBed.inject(TodoDataService);
    navigationService = TestBed.inject(NavigationService);
  });

  function initComponent(items: TodoItem[] = [], matrixKindId = MATRIX_KIND.ALL, matrixX: MatrixX | null = MatrixX.Urgent, matrixY: MatrixY | null = MatrixY.Important): void {
    const todoItems: TodoItem[] = [...items];
    const item1 = new TodoItem('id1', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 1', MatrixX.Urgent, MatrixY.Important, "Note 1", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const item2 = new TodoItem('id2', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 2', MatrixX.Urgent, MatrixY.Important, "Note 2", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const item4 = new TodoItem('id4', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 4', MatrixX.NotUrgent, MatrixY.Important, "Note 4", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const item5 = new TodoItem('id5', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 5', MatrixX.NotUrgent, MatrixY.NotImportant, "Note 5", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const item6 = new TodoItem('id6', '6a93632e-0e04-47ea-bd7f-619862a71c30', 'Task 6', MatrixX.Urgent, MatrixY.NotImportant, "Note 6", null,  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    const itemDueToday = new TodoItem('id3', '15ed938b-ec9b-49ec-8575-5c721eff6639', 'Task 3', MatrixX.Urgent, MatrixY.Important, "Note 3", getToday(),  DateTime.now().toUTC(), DateTime.now().toUTC(), null, false);
    todoItems.push(item1);
    todoItems.push(item2);
    todoItems.push(itemDueToday);
    todoItems.push(item4);
    todoItems.push(item5);
    todoItems.push(item6);
    fakeTodoDataService.setGetTodoItems(todoItems);
    
    const lists = [
      new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
      new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63'),
      new TodoList('d227c8e8-7aa8-4b7b-8782-644f87de5b98', 'Project Z', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#ffc107')
    ];

    fakeTodoDataService.setGetLists(lists);
    
    
    const params: Params = {};
    params[TODO_MATRIX_KIND_ID] = matrixKindId;
    fakeActivatedRoute.setParamMap(params);

    if (matrixX != null && matrixY != null) {
      const queryParams: Params = {};
      queryParams[TODO_QUERY_PARAM_MATRIX_X] = matrixX.toString();
      queryParams[TODO_QUERY_PARAM_MATRIX_Y] = matrixY.toString();
      fakeActivatedRoute.setQueryParamMap(queryParams);  
    } else {
      fakeActivatedRoute.setQueryParamMap({}); 
    }
    
    fixture.detectChanges();
    tick();
  }

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display title based on matrix kind id with default list all', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL);
    const titleElem = fixture.debugElement.query(By.css('#list-title')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('All');
  }));

  it('should display title based on matrix kind id with default list today', fakeAsync(() => {
    initComponent([], MATRIX_KIND.TODAY);
    const titleElem = fixture.debugElement.query(By.css('#list-title')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Today');
  }));

  it('should display title based on matrix kind id with default list upcoming', fakeAsync(() => {
    initComponent([], MATRIX_KIND.UPCOMING);
    const titleElem = fixture.debugElement.query(By.css('#list-title')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Upcoming');
  }));

  it('should display title based on matrix kind id with user created list', fakeAsync(() => {
    initComponent([], '6a93632e-0e04-47ea-bd7f-619862a71c30');
    const titleElem = fixture.debugElement.query(By.css('#list-title')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Project X');
  }));

  it('should display subtitle based on matrix quadrant coordinates: MatrixY.Important  - MatrixX.Urgent ', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL, MatrixX.Urgent, MatrixY.Important);
    const titleElem = fixture.debugElement.query(By.css('#list-subtitle')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Important and urgent');
  }));

  it('should display subtitle based on matrix quadrant coordinates: MatrixY.Important - MatrixX.NotUrgent ', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL, MatrixX.NotUrgent, MatrixY.Important);
    const titleElem = fixture.debugElement.query(By.css('#list-subtitle')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Important and not urgent');
  }));

  it('should display subtitle based on matrix quadrant coordinates: MatrixX.Urgent - MatrixY.NotImportant ', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL, MatrixX.Urgent, MatrixY.NotImportant);
    const titleElem = fixture.debugElement.query(By.css('#list-subtitle')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Urgent and not important');
  }));

  it('should display subtitle based on matrix quadrant coordinates: MatrixX.NotUrgent - MatrixY.NotImportant ', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL, MatrixX.NotUrgent, MatrixY.NotImportant);
    const titleElem = fixture.debugElement.query(By.css('#list-subtitle')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Not urgent and not important');
  }));

  it('should display subtitle if no matrix coordinates are supplied.', fakeAsync(() => {
    initComponent([], MATRIX_KIND.ALL, null, null);
    const titleElem = fixture.debugElement.query(By.css('#list-subtitle')).nativeElement as HTMLElement;

    expect(titleElem.innerText).toEqual('Displaying all items');
  }));

  it('should display todo items in a list', fakeAsync(async () => {
    initComponent([], MATRIX_KIND.ALL, null, null);

    const matListHarness = await loader.getHarness(MatListHarness.with({selector: 'mat-list'}));
    const itemsHarnesses = await matListHarness.getItems();
    const textOfItemsInView = await Promise.all(itemsHarnesses.map(h => h.getText()));

    expect(textOfItemsInView.length).toEqual(6);
    expect(textOfItemsInView[0]).toEqual('Task 1');
  }));

  it('should be able to mark a todo item as done.', fakeAsync(() => {
    const changeDoneStatusOfItemsSpy = spyOn(todoDataService, 'changeDoneStatusOfItems').and.callThrough();
    const markAsDoneSpy = spyOn(component, 'onDoneChanged').and.callThrough();
    initComponent();

    const itemDebugElems = fixture.debugElement.queryAll(By.directive(TodoListItemStubComponent));
    const itemComponents = itemDebugElems.map(de => de.injector.get(TodoListItemStubComponent));

    const firstItemComponent = itemComponents[0];
    firstItemComponent.triggerDoneChanged(true);

    expect(markAsDoneSpy).toHaveBeenCalled();
    const expectedMapOfChanged: { [key: string]: boolean } = {};
    expectedMapOfChanged[ (firstItemComponent.item as TodoViewListItem).id] = true;
    expect(changeDoneStatusOfItemsSpy).toHaveBeenCalledWith(expectedMapOfChanged);
  }));

  it('should be able to unmark a todo item as done.', fakeAsync(() => {
    const changeDoneStatusOfItemsSpy = spyOn(todoDataService, 'changeDoneStatusOfItems').and.callThrough();
    const markAsDoneSpy = spyOn(component, 'onDoneChanged').and.callThrough();
    initComponent();

    const itemDebugElems = fixture.debugElement.queryAll(By.directive(TodoListItemStubComponent));
    const itemComponents = itemDebugElems.map(de => de.injector.get(TodoListItemStubComponent));

    const firstItemComponent = itemComponents[0];
    firstItemComponent.triggerDoneChanged(false);

    expect(markAsDoneSpy).toHaveBeenCalled();
    const expectedMapOfChanged: { [key: string]: boolean } = {};
    expectedMapOfChanged[ (firstItemComponent.item as TodoViewListItem).id] = false;
    expect(changeDoneStatusOfItemsSpy).toHaveBeenCalledWith(expectedMapOfChanged);
  }));

  it('should offer a back button (return to previous view)', async () => {   
    const matButtonHarnessBackBtn = await loader.getHarness(MatButtonHarness.with({text: 'arrow_back'}));
    await matButtonHarnessBackBtn.click();

    expect(navigationService.back).toHaveBeenCalled();
  });

  it('should offer an action menu', async () => {
    const matButtonHarnessActionMenu = await loader.getHarness(MatButtonHarness.with({ text: 'more_vert'}));

    expect(matButtonHarnessActionMenu).toBeDefined();
  });

  it('should offer action to display all items of a list.', () => {

  });


});
