import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TodoItem, MatrixX, MatrixY } from 'src/app/common/models';
import { TodoDataService } from 'src/app/common/data';
import { SpinnerService } from 'src/app/root/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TodoItemEditorComponent } from './todo-item-editor.component';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

function createTodoItem(id?: string, name?: string, note?: string,
  dueDate?: Date, createdAt?: Date, modifiedAt?: Date): TodoItem {
  id = id ? id : '';
  name = name ? name : '';
  note = note ? note : '';
  dueDate = dueDate ? dueDate : new Date(9999, 1, 1);
  createdAt = createdAt ? createdAt : new Date(2021, 8, 1);
  modifiedAt = modifiedAt ? modifiedAt : new Date(2021, 8, 1);
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
  let todoService: TodoDataService;
  let router: Router;
  let spinnerService: SpinnerService;
  let toastr: ToastrService;

  let fakeTodoService: FakeTodoService;
  let activatedRouteStub: ActivatedRouteStub;
  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
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
        NoopAnimationsModule
      ],
      declarations: [ TodoItemEditorComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: SpinnerService, useValue: spinnerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TodoDataService, useValue: fakeTodoService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemEditorComponent);
    router = TestBed.inject(Router);
    spinnerService = TestBed.inject(SpinnerService);
    toastr = TestBed.inject(ToastrService);
    todoService = TestBed.inject(TodoDataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
      // init
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

    // init component
    fakeTodoService.setGetTodoItemReturnValue(createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc'));
    activatedRouteStub.setParamMap({id: '35f5d62c-1527-496e-b357-02f32e3906dc'});
    fixture.detectChanges();
    tick();

    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  it('should initialize component in creation state when route param id equals "new".', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();
    // init component
    fakeTodoService.setGetTodoItemReturnValue(createTodoItem());
    activatedRouteStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    
    expect(todoService.getTodoItem).not.toHaveBeenCalled();
    expect(component.headerTitle).toEqual('Add task');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual('');
    expect(component.form?.get('dueDate')?.value).toEqual(new Date(9999,1, 1));
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
    expect(component.todoItem?.id).toEqual('');
  }));

  it('should initialize component in creation state when route param id is non-existent.', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();
    // init component
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({id: 'unknown-id-01'});
    fixture.detectChanges();
    tick();


    const expectedTodoListId = 'unknown-id-01';
    expect(todoService.getTodoItem).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.headerTitle).toEqual('Add task');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual('');
    expect(component.form?.get('dueDate')?.value).toEqual(new Date(9999,1, 1));
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
    expect(component.todoItem?.id).toEqual('');
  }));

  it('should initialize component in edit state when route param is an existing id', fakeAsync(() => {
    spyOn(todoService, 'getTodoItem').and.callThrough();
    // init component
    const id = '35f5d62c-1527-496e-b357-02f32e3906dc';
    const name = 'Task 1';
    const note = 'Research required';
    fakeTodoService.setGetTodoItemReturnValue(createTodoItem(id, name, note));
    activatedRouteStub.setParamMap({id: id});
    fixture.detectChanges();
    tick();

    
    expect(todoService.getTodoItem).toHaveBeenCalledWith(id);
    expect(component.headerTitle).toEqual('Edit task');
    expect(component.todoItem?.id).toEqual(id);
    expect(component.form?.get('name')?.value).toEqual(name);
    expect(component.form?.get('listId')?.value).toEqual(null);
    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.NotUrgent);
    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.NotImportant);
    expect(component.form?.get('note')?.value).toEqual(note);
    expect(component.form?.get('dueDate')?.value).toEqual(new Date(9999,1, 1));
    expect(component.form?.get('markedAsDone')?.value).toEqual(false);
  }));

  it('should disable the save button when form is invalid.', fakeAsync(() => {
    // init
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    const btnDebugEleements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const saveBtnElement: HTMLButtonElement = btnDebugEleements[1].nativeElement;

    expect(saveBtnElement.disabled).toBeTruthy();
  }));

  it('shoud disable the save button when there are no changes.', fakeAsync(() => {
    // init
    const item = createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc', 'My task');
    fakeTodoService.setGetTodoItemReturnValue(item);
    activatedRouteStub.setParamMap({id: '35f5d62c-1527-496e-b357-02f32e3906dc'});
    fixture.detectChanges();
    tick();

    const btnDebugElements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const saveBtnElement: HTMLButtonElement = btnDebugElements[1].nativeElement;

    expect(saveBtnElement.disabled).toBeTruthy();
  }));
 
  it('should enable the save button when there are changes.', fakeAsync(() => {
    // init component
    const todoItem = createTodoItem('35f5d62c-1527-496e-b357-02f32e3906dc', 'My task');
    fakeTodoService.setGetTodoItemReturnValue(todoItem);
    activatedRouteStub.setParamMap({ id: '35f5d62c-1527-496e-b357-02f32e3906dc'});
    fixture.detectChanges();
    tick();

    const btnDebugEleements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const saveBtnElement: HTMLButtonElement = btnDebugEleements[1].nativeElement;

    component.form?.patchValue({name: 'Task 1.2'});
    fixture.detectChanges();

    expect(saveBtnElement.disabled).toBeFalsy();
  }));

  it('should be able to set a name for an todo item', fakeAsync(() => {
    // init
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({ id: 'new' });
    fixture.detectChanges();
    tick();

    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebugElement.nativeElement;

    inputElement.value = 'Task 42';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.form?.get('name')?.value).toEqual('Task 42');
  }));

  it('should be able to select todo list.', fakeAsync(() => {

  }));

  xit('should be able to add a note.', fakeAsync(() => {
    // TODO: look at this later, I have done the mocking of textare input somewhere atleast once if I remember correctly...
  }));

  it('should be able to set matrix x.', fakeAsync(() => {
    // init 
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({ id: 'new'});
    fixture.detectChanges();
    tick();

    const matrixXDebugElements = fixture.debugElement.queryAll(By.css('#matrix-x-container mat-button-toggle-group mat-button-toggle button'));
    const matrixXElement: HTMLElement = matrixXDebugElements[0].nativeElement;

    matrixXElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.form?.get('matrixX')?.value).toEqual(MatrixX.Urgent);
  }));

  it('should be able to set matrix y.', fakeAsync(() => {
    // init
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({ id: 'new'});
    fixture.detectChanges();
    tick();

    const matrixYBtnDebugElements = fixture.debugElement.queryAll(By.css('#matrix-y-container mat-button-toggle-group mat-button-toggle button'));
    const matrixYElement: HTMLElement = matrixYBtnDebugElements[0].nativeElement;
    
    matrixYElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.form?.get('matrixY')?.value).toEqual(MatrixY.Important);
  }));

  it('should be able to set due date.', fakeAsync(() => {

  }));

  it('should be able to mark todo item as done.', fakeAsync(() => {
      // init 
      fakeTodoService.setGetTodoItemReturnValue(undefined);
      activatedRouteStub.setParamMap({ id: 'new'});
      fixture.detectChanges();
      tick();

      const checkBoxDebugElement = fixture.debugElement.query(By.css('mat-checkbox input'));
      const checkElement: HTMLInputElement = checkBoxDebugElement.nativeElement;

      checkElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(component.form?.get('markedAsDone')?.value).toBeTruthy();
  }));

  it('should be able to delete the todo item.', fakeAsync(() => {

  }));

  it('should be able to cancel and leave dialog.', fakeAsync(() => {
    const onCancelSpy = spyOn(component, 'onCancel').and.callThrough();
    // init 
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({ id: 'new'});
    fixture.detectChanges();
    tick();

    const btnDebugElements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const cancelBtnElement: HTMLButtonElement = btnDebugElements[0].nativeElement;

    cancelBtnElement.dispatchEvent(new Event('click'));

    expect(onCancelSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should be able to save a todo item.', fakeAsync(() => {
    const onSaveSpy = spyOn(component, 'onSave').and.callThrough();
    const setTodoItemSpy = spyOn(todoService, 'setTodoItem').and.callThrough();
    // mock return value for easier expected comparison later on, since there are new Date() calls
    const itemSetByInit = createTodoItem('', '', '',  new Date(9999,1, 1));
    // mock return value of setTodoItem 
    fakeTodoService.setTodoItem(createTodoItem('1', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt));

    spyOn(component, 'createEmptyTodoItem').and.returnValue(itemSetByInit);
    // init
    fakeTodoService.setGetTodoItemReturnValue(undefined);
    activatedRouteStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    const btnDebugElements = fixture.debugElement.queryAll(By.css('form .actions-container button'));
    const saveBtnElement: HTMLButtonElement = btnDebugElements[1].nativeElement;

    // make sure form is valid
    component.form?.patchValue({
      name: 'Task 42',
      note: 'finish it fast'
    });
    // simulate a click on save btn
    saveBtnElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick();

    // assert
    const expectedTodoItem = createTodoItem('', 'Task 42', 'finish it fast',  itemSetByInit.dueDate, itemSetByInit.createdAt, itemSetByInit.modifiedAt);
    expect(onSaveSpy).toHaveBeenCalled();
    expect(setTodoItemSpy).toHaveBeenCalledWith(expectedTodoItem);
  }));

  it('should display saving indicator.', fakeAsync(() => {

  }));

  it('should display success message after saving.', fakeAsync(() => {

  }));

  it('should display error message if the saving fails for whatever reason.', fakeAsync(() => {

  }));

  it('')
});
