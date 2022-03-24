import { TODO_NAVIGATOR_TOKEN } from 'src/app/todo';
import { throwError, of } from 'rxjs';
import { MatLuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TodoItem, MatrixX, MatrixY, TodoList } from 'src/app/common/models';
import { ITodoDataService, TODO_DATA_SERVICE_INJECTION_TOKEN } from 'src/app/common/data';
import { SpinnerService } from 'src/app/root/services/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TodoItemEditorComponent } from './todo-item-editor.component';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateTime } from 'luxon';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSelectModule } from '@angular/material/select';
import { ITodoNavigator } from '../..';

function createTodoItem(id?: string, name?: string, note?: string,
  dueDate?: DateTime | null, createdAt?: DateTime, modifiedAt?: DateTime): TodoItem {
  id = id ? id : '';
  name = name ? name : '';
  note = note ? note : '';
  dueDate = dueDate ? dueDate : null;
  createdAt = createdAt ? createdAt : DateTime.utc(2021, 8, 1);
  modifiedAt = modifiedAt ? modifiedAt : DateTime.utc(2021, 8, 1);
  return new TodoItem(
    id,
    null,
    name,
    MatrixX.NotUrgent,
    MatrixY.NotImportant,
    note,
    dueDate,
    createdAt,
    modifiedAt,
    null,
    false
  );
}

describe('TodoItemEditorComponent', () => {
  let component: TodoItemEditorComponent;
  let fixture: ComponentFixture<TodoItemEditorComponent>;
  let todoService: ITodoDataService;
  let navigationService: ITodoNavigator;
  let spinnerService: SpinnerService;
  let toastr: ToastrService;
  let loader: HarnessLoader;

  let fakeTodoService: FakeTodoService;
  let activatedRouteStub: ActivatedRouteStub;
  beforeEach(async () => {

    const spyNavigationService = jasmine.createSpyObj<ITodoNavigator>('NavigationService', ['back']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    fakeTodoService = new FakeTodoService();
    activatedRouteStub = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports:[
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatLuxonDateModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      declarations: [ TodoItemEditorComponent ],
      providers: [
        { provide: TODO_NAVIGATOR_TOKEN, useValue: spyNavigationService },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: SpinnerService, useValue: spinnerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TODO_DATA_SERVICE_INJECTION_TOKEN, useValue: fakeTodoService },
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemEditorComponent);
    navigationService = TestBed.inject(TODO_NAVIGATOR_TOKEN);
    spinnerService = TestBed.inject(SpinnerService);
    toastr = TestBed.inject(ToastrService);
    todoService = TestBed.inject(TODO_DATA_SERVICE_INJECTION_TOKEN);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

  });

  function initComponentInNewState(): void {
    const lists = [
      new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
      new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63')
    ];
    fakeTodoService.setGetLists(lists);
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({ id: 'new'});
    fixture.detectChanges();
    tick();
  }

  function initComponentInEditState(todoItem: TodoItem | undefined): void {
    const lists = [
      new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'Project X', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#4caf50'),
      new TodoList('15ed938b-ec9b-49ec-8575-5c721eff6639', 'Project Y', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#e91e63')
    ];
    fakeTodoService.setGetLists(lists);
    if (todoItem) {
      fakeTodoService.setGetTodoItemReturnValue(todoItem);
      activatedRouteStub.setParamMap({ id: todoItem.id});
    } else {
      fakeTodoService.setGetTodoItemReturnValue(undefined);
      activatedRouteStub.setParamMap({ id: 'unknown-id-01'});
    }
    fixture.detectChanges();
    tick();
  }

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('.activateSpinner()', () => {
    
    it('should set property indicating request is in progress to true', () => {
      expect(component.isRequestInProgress).toBeFalse();
      component.activateSpinner();
      expect(component.isRequestInProgress).toBeTrue();
    });

    it('should show spinner-', () => {
      component.activateSpinner();
      expect(spinnerService.show).toHaveBeenCalledWith(component.spinnerName);
    });
  });

  describe('.deactivateSpinner()', () => {
    
    it('should set property indicating request is in progress to false', () => {
      component.activateSpinner();
      
      component.deactivateSpinner();

      expect(component.isRequestInProgress).toBeFalse();
    });

    it('should hide spinner.', () => {
      component.deactivateSpinner();
      expect(spinnerService.hide).toHaveBeenCalledWith(component.spinnerName);
    });
  });

  it('should display loading progress indicator on initialization.', fakeAsync(() => {
    const activateSpinnerSpy = spyOn(component, 'activateSpinner').and.callThrough();
    const deactivateSpinnerSpy = spyOn(component, 'deactivateSpinner').and.callThrough();

    initComponentInEditState( createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc'));

    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  it('should initialize component in creation state when route param id equals "new".', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();

    initComponentInNewState();

    
    expect(todoService.getTodoItem).not.toHaveBeenCalled();
    expect(component.headerTitle).toEqual('Add task');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual('');
    expect(component.form?.get('dueDate')?.value).toEqual(null);
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
    expect(component.todoItem?.id).toEqual('');
  }));

  it('should initialize component in creation state when route param id is non-existent.', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();

    initComponentInEditState(undefined);

    const expectedTodoListId = 'unknown-id-01';
    expect(todoService.getTodoItem).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.headerTitle).toEqual('Add task');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual('');
    expect(component.form?.get('dueDate')?.value).toEqual(null);
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
    expect(component.todoItem?.id).toEqual('');
  }));

  it('should initialize component in edit state when route param is an existing id', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();
    const todoItem = createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc', 'Task 1', 'Research required');
    initComponentInEditState(todoItem);
    
    expect(todoService.getTodoItem).toHaveBeenCalledWith(todoItem.id);
    expect(component.headerTitle).toEqual('Edit task');
    expect(component.todoItem?.id).toEqual(todoItem.id);
    expect(component.form?.get('name')?.value).toEqual(todoItem.name);
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual(todoItem.note);
    expect(component.form?.get('dueDate')?.value).toEqual(null);
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
  }));

  it('should disable the save button when form is invalid.', fakeAsync(() => {
    initComponentInNewState();

    const btnDebugEleements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const saveBtnElement: HTMLButtonElement = btnDebugEleements[1].nativeElement;

    expect(saveBtnElement.disabled).toBeTruthy();
  }));

  it('shoud disable the save button when there are no changes.', fakeAsync(async () => {
    // init
    const item = createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc', 'My task');
    initComponentInEditState(item);

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({text: 'Save'}));

    component.form?.patchValue({name: 'My task'});

    fixture.detectChanges();

    expect(await saveBtnHarness.isDisabled()).toBeTruthy();
  }));
 
  it('should enable the save button when there are changes.', fakeAsync(async () => {
    // init component
    const todoItem = createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc', 'My task');
    initComponentInEditState(todoItem);

    const saveBtnharness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    component.form?.patchValue({name: 'Task 1.2'});
    fixture.detectChanges();

    expect(await saveBtnharness.isDisabled()).toBeFalsy();
  }));

  it('should be able to set a name for an todo item', fakeAsync(async () => {
    initComponentInNewState();

    const nameInputHarness = await loader.getHarness(MatInputHarness);
    await nameInputHarness.setValue('Task 42');

    expect(component.form?.get('name')?.value).toEqual('Task 42');
  }));

  it('should be able to select todo list.', fakeAsync(async () => {
    initComponentInNewState();

    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.open();

    const list2Option = await selectHarness.getOptions();
    // 2 because there is an "empty" option
    await list2Option[2].click();

    expect(component.form?.get('listId')?.value).toEqual('15ed938b-ec9b-49ec-8575-5c721eff6639');
  }));

  it('should be able to add a note.', fakeAsync(async () => {
    initComponentInNewState();

    const noteInputHarness = await loader.getHarness(MatInputHarness.with({ selector: '#note-input'}));
    await noteInputHarness.setValue('Just a simple note.');

    expect(component.form?.get('note')?.value).toEqual('Just a simple note.');
  }));

  it('should be able to set matrix x.', fakeAsync(async () => {
    initComponentInNewState();

    const matrixXButtonToggleHarness = await loader.getHarness(MatButtonToggleHarness.with({text: 'Urgent'}));
    await matrixXButtonToggleHarness.toggle();
   
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.Urgent);
  }));

  it('should be able to set matrix y.', fakeAsync(async () => {
    initComponentInNewState();

    const matrixYButtonToggleHarness = await loader.getHarness(MatButtonToggleHarness.with({text: 'Important'}));
    await matrixYButtonToggleHarness.toggle();

    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.Important);
  }));

  it('should be able to set due date.', fakeAsync(async () => {
    initComponentInNewState();

    const datePickerHarness = await loader.getHarness(MatDatepickerInputHarness);
    await datePickerHarness.setValue('22/01/2021');
    fixture.detectChanges();
    tick();

    const dateInForm: DateTime = component.form?.get('dueDate')?.value;
    expect(dateInForm.equals(DateTime.utc(2021, 1, 22).setLocale('en-GB'))).toBeTruthy();
  }));

  it('should be able to mark todo item as done.', fakeAsync(async () => {
    initComponentInNewState();

    const markAsDoneCheckBoxHarness = await loader.getHarness(MatCheckboxHarness);
    await markAsDoneCheckBoxHarness.toggle();

    expect(component.form?.get('markedAsDone')?.value).toBeTruthy();
  }));

  xit('should be able to delete the todo item.', fakeAsync(() => {
    // TODO: unsure whether I want the delete operation in these editor dialogs or whether they should be actions in the lists
    // maybe both is the best. It could be pretty annoying for a user to either find the delete action or have to change to a different view to actually delete an item he changed his opinion about.
  }));

  it('should be able to cancel and leave dialog.', fakeAsync(async () => {
    const onCancelSpy = spyOn(component, 'onCancel').and.callThrough();
    initComponentInNewState();

    const cancelBtnHarness = await loader.getHarness(MatButtonHarness.with({text: 'Cancel'}));
    await cancelBtnHarness.click();

    expect(onCancelSpy).toHaveBeenCalled();
    expect(navigationService.back).toHaveBeenCalled();
  }));

  it('should be able to save a todo item.', fakeAsync(async () => {
    const onSaveSpy = spyOn(component, 'onSave').and.callThrough();
    const setTodoItemSpy = spyOn(todoService, 'setTodoItem').and.callThrough();
    // mock return value for easier expected comparison later on, since there are DateTime.utc() calls
    const itemSetByInit = createTodoItem('', '', '', null);
    spyOn(component, 'createEmptyTodoItem').and.returnValue(itemSetByInit);

    // init
    initComponentInNewState();

    // mock return value of setTodoItem 
    fakeTodoService.setTodoItemReturnValue = of(createTodoItem('1', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt));

    // make sure form is valid
    component.form?.patchValue({
      name: 'Task 42',
      note: 'finish it fast'
    });

    // simulate a click on save btn
    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));
    await saveBtnHarness.click();

    // assert
    const expectedTodoItem = createTodoItem('', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt);
    expect(onSaveSpy).toHaveBeenCalled();
    expect(setTodoItemSpy).toHaveBeenCalledWith(expectedTodoItem);
  }));

  it('should display saving indicator.', fakeAsync(async () => {
    const activateSpinnerSpy = spyOn(component, 'activateSpinner').and.callThrough();
    const deactivateSpinnerSpy = spyOn(component, 'deactivateSpinner').and.callThrough();
    // mock return value for easier expected comparison later on, since there are DateTime.utc() calls
    const itemSetByInit = createTodoItem('', '', '', null);
    spyOn(component, 'createEmptyTodoItem').and.returnValue(itemSetByInit);

    // init
    initComponentInNewState();
    // mock return value of setTodoItem 
    fakeTodoService.setTodoItemReturnValue = of(createTodoItem('1', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt));

    activateSpinnerSpy.calls.reset();
    deactivateSpinnerSpy.calls.reset();

    // make sure form is valid
    component.form?.patchValue({
      name: 'Task 42',
      note: 'finish it fast'
    });

    // simulate a click on save btn
    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));
    await saveBtnHarness.click();
    fixture.detectChanges();
    tick();
    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  it('should display success message after saving.', fakeAsync(async () => {
    // mock return value for easier expected comparison later on, since there are DateTime.utc() calls
    const itemSetByInit = createTodoItem('', '', '',  null);
    spyOn(component, 'createEmptyTodoItem').and.returnValue(itemSetByInit);

    // mock return value of setTodoItem 
    fakeTodoService.setTodoItemReturnValue = of(createTodoItem('1', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt));

    // init
    initComponentInNewState();

    // make sure form is valid
    component.form?.patchValue({
      name: 'Task 42',
      note: 'finish it fast'
    });

    // simulate a click on save btn
    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));
    await saveBtnHarness.click();
    fixture.detectChanges();
    tick();
    expect(toastr.success).toHaveBeenCalledWith('Item saved.');
  }));

  it('should display error message if the saving fails for whatever reason.', fakeAsync(async () => {
    // mock return value for easier expected comparison later on, since there are DateTime.utc() calls
    const itemSetByInit = createTodoItem('', '', '',  null);
    spyOn(component, 'createEmptyTodoItem').and.returnValue(itemSetByInit);

    // mock return value of setTodoItem 
    fakeTodoService.setTodoItemReturnValue = throwError("Api Error");

    // init
    initComponentInNewState();

    // make sure form is valid
    component.form?.patchValue({
      name: 'Task 42',
      note: 'finish it fast'
    });

    // simulate a click on save btn
    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));
    await saveBtnHarness.click();
    fixture.detectChanges();
    tick();
    expect(toastr.error).toHaveBeenCalledWith('Ups, sorry! :( Something went wrong, try again later.');
  }));
});
