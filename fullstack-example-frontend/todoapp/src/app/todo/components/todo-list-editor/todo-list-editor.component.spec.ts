import { ITodoNavigator, TODO_NAVIGATOR_TOKEN } from 'src/app/todo';
import { TodoList } from 'src/app/common/models';
import { throwError, of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoListEditorComponent } from './todo-list-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoDataService } from 'src/app/common/data';
import { SpinnerService } from 'src/app/root/services/spinner.service';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { DateTime } from 'luxon';

const colorCirleBinding = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorCircleMockComponent),
  multi: true
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'color-circle',
  template: ``,
  providers: [colorCirleBinding]
})
export class ColorCircleMockComponent implements ControlValueAccessor {

  private color = '';
  private isDisabled = false;

  private cbRegisterOnChange: any;
  private cbRegisterOnTouched: any;

  writeValue(obj: any): void {
    this.color = obj;
  }
  registerOnChange(fn: any): void {
    this.cbRegisterOnChange = fn; 
  }
  registerOnTouched(fn: any): void {
    this.cbRegisterOnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  triggerChange(hex: string): void {
    this.cbRegisterOnChange(hex);
    this.cbRegisterOnTouched(hex);
  }

  getColor(): string {
    return this.color;
  }
 
}

describe('TodoListEditorComponent', () => {
  let component: TodoListEditorComponent;
  let fixture: ComponentFixture<TodoListEditorComponent>;
  let navigationService: ITodoNavigator;
  let toastr: ToastrService;
  let todoService: TodoDataService;
  let spinnerService: SpinnerService;
  let loader: HarnessLoader;

  let todoServiceFake: FakeTodoService;
  let routeStub: ActivatedRouteStub;

  beforeEach(async () => {
    const spyNavigationService = jasmine.createSpyObj<ITodoNavigator>('NavigationService', ['navigate', 'back']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    todoServiceFake = new FakeTodoService();
    routeStub = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TODO_NAVIGATOR_TOKEN, useValue: spyNavigationService },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TodoDataService, useValue: todoServiceFake },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: SpinnerService, useValue: spinnerSpy }
      ],
      declarations: [ 
        ColorCircleMockComponent,
        TodoListEditorComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListEditorComponent);
    navigationService = TestBed.inject(TODO_NAVIGATOR_TOKEN);
    toastr = TestBed.inject(ToastrService);
    todoService = TestBed.inject(TodoDataService);
    spinnerService = TestBed.inject(SpinnerService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  function initComponentInNewState(): void {
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();
  }

  function initComponentInEditState(todoItem: TodoList | undefined): void {
    if (todoItem) {
      todoServiceFake.setGetListReturnValue(todoItem);
      routeStub.setParamMap({ id: todoItem.id});
    } else {
      todoServiceFake.setGetListReturnValue(undefined);
      routeStub.setParamMap({ id: 'unknown-id-01'});
    }
    fixture.detectChanges();
    tick();
  }

  it('should create', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});

    fixture.detectChanges();
    tick();

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
      // new init state
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

    initComponentInEditState(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#121212'));

    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  it('should initialize component in creation state when route param id equals "new".', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();

    initComponentInNewState();
    
    expect(todoService.getList).not.toHaveBeenCalled();
    expect(component.headerTitle).toEqual('Add list');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('');
    expect(component.todoList).toBeDefined();
    expect(component.todoList?.id).toEqual('');
  }));

  it('should initialize component in creation state when route param id is non-existent.', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();

    initComponentInEditState(undefined);

    const expectedTodoListId = 'unknown-id-01';
    expect(todoService.getList).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.headerTitle).toEqual('Add list');
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('');
    expect(component.todoList).toBeDefined();
    expect(component.todoList?.id).toEqual('');
  }));

  it('should initialize component in edit state when route param is an existing id', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();

    initComponentInEditState(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#121212'));

    const expectedTodoListId = '6a93632e-0e04-47ea-bd7f-619862a71c30';
    expect(todoService.getList).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.headerTitle).toEqual('Edit list');
    expect(component.todoList?.id).toEqual(expectedTodoListId);
    expect(component.form?.get('name')?.value).toEqual('my list name');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('#121212');
  }));

  it('should disable the save button when form is invalid.', fakeAsync(async () => {
    initComponentInNewState();

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    expect(await saveBtnHarness.isDisabled()).toBeTruthy('should disable create button');
  }));

  it('should disable save button when there are no changes.', fakeAsync(async () => {
    initComponentInNewState();

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    component.form?.patchValue({name: 'my list name'});
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '');

    fixture.detectChanges();

    expect(await saveBtnHarness.isDisabled()).toBeTruthy();
  }));

  it('should enable save button when there are changes.', fakeAsync(async () => {
    initComponentInNewState();

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    component.form?.patchValue({name: 'changed name'});
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '');

    fixture.detectChanges();

    expect(await saveBtnHarness.isDisabled()).toBeFalsy();
  }));

  it('should display form validation errors in the UI.', fakeAsync(async () => {
    initComponentInNewState();

    // simulate empty input input and touched
    component.form?.patchValue({name: ''});
    component.form?.get('name')?.markAsTouched();

    fixture.detectChanges();

    const errorFormFieldHarness = await loader.getHarness(MatFormFieldHarness.with({ selector: '#name-input'}));

    expect(await errorFormFieldHarness.hasErrors()).toBeTruthy();
    expect(await errorFormFieldHarness.getTextErrors()).toEqual(['You must enter a name.']);
  }));

  it('should enable the save button when form is valid.', fakeAsync(async () => {
    initComponentInNewState();

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    expect(await saveBtnHarness.isDisabled()).toBeTruthy();

    component.form?.patchValue({name: 'My List 1'});

    fixture.detectChanges();

    expect(await saveBtnHarness.isDisabled()).toBeFalsy();
  }));

  it('should be able to set a name of a list.', fakeAsync(async () => {
    initComponentInNewState();

    const nameInputHarness = await loader.getHarness(MatInputHarness);
    await nameInputHarness.setValue('My List 1');

    expect(component.form?.get('name')?.value).toEqual('My List 1');
  }));

  it('should be able set a description of a list.', fakeAsync(async () => {
    initComponentInNewState();

    const descriptionInputHarness = await loader.getHarness(MatInputHarness.with({ selector: 'textarea'}));
    await descriptionInputHarness.setValue('my interesting description');

    expect(component.form?.get('description')?.value).toEqual('my interesting description');
  }));

  it('should be able set a background color of a list.', fakeAsync(() => {
    initComponentInNewState();

    const colorComponent = fixture.debugElement.query(By.css('color-circle')).injector.get(ColorCircleMockComponent);

    colorComponent.triggerChange('#808080');
    fixture.detectChanges();

    expect(component.form?.get('bgColor')?.value).toEqual('#808080');
  }));

  it('should display background color of a list.', fakeAsync(() => {
    initComponentInNewState();

    const colorComponent = fixture.debugElement.query(By.css('color-circle')).injector.get(ColorCircleMockComponent);

    component.form?.patchValue({bgColor: '#020202'});
    fixture.detectChanges();

    expect(colorComponent.getColor()).toEqual('#020202')
  }));

  it('should be able to cancel', fakeAsync(async () => {
    const onCancelSpy = spyOn(component, 'onCancel').and.callThrough();

    initComponentInNewState();

    const cancelBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Cancel'}));
    await cancelBtnHarness.click();

    expect(onCancelSpy).toHaveBeenCalled();
    expect(navigationService.back).toHaveBeenCalled();
  }));

  it('should be able to save a list.', fakeAsync(async () => {
    const onSaveSpy = spyOn(component, 'onSave').and.callThrough();
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'));
    const setListSpy = spyOn(todoService, 'setList').and.callThrough();

    initComponentInNewState();

    const saveBtnHarness = await loader.getHarness(MatButtonHarness.with({ text: 'Save'}));

    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
      name: 'My Listname',
      description: '42',
      bgColor: '#111111'
    });

    saveBtnHarness.click();

    fixture.detectChanges();
    tick();
    
    const expectedList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111');
    expect(onSaveSpy).toHaveBeenCalled();
    expect(setListSpy).toHaveBeenCalledWith(expectedList);
  }));


  it('should display saving progress indicator.', fakeAsync(() => {
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'));
    const activateSpinnerSpy = spyOn(component, 'activateSpinner');
    const deactivateSpinnerSpy = spyOn(component, 'deactivateSpinner');

    initComponentInNewState();
    activateSpinnerSpy.calls.reset();
    deactivateSpinnerSpy.calls.reset();

    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
       name: 'My Listname',
       description: '42',
       bgColor: '#111111'
    });

    component.onSave();

    tick(); // flush the component's setTimeout()
    fixture.detectChanges(); // update after SetTimeout

    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  // TODO: remember to force the API to do the same thing.
  it('should assign a random color to a list if user choose none.', fakeAsync(() => {
    todoServiceFake.setListReturnValue = of( new TodoList('', 'My list name', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#444444'));
    const setListSpy = spyOn(todoService, 'setList').and.callThrough();
        
    initComponentInNewState();

    // mock old list
    component.todoList = new TodoList('', '', '', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, ''); 
    // set values to be saved
    component.form?.setValue({
       name: 'My list name',
       description: '42',
       bgColor: ''
    });

    component.onSave();

    tick(); // flush the component's setTimeout()
    fixture.detectChanges(); // update after SetTimeout

    expect(setListSpy.calls.mostRecent().args[0].color).not.toEqual('');
  }));
  

  it('should show success message after saving', fakeAsync(() => {
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'));
        
    initComponentInNewState();

    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
       name: 'My Listname',
       description: '42',
       bgColor: '#111111'
    });

    component.onSave();

    tick(); // flush the component's setTimeout()
    fixture.detectChanges(); // update after SetTimeout
    
    expect(toastr.success).toHaveBeenCalledWith('List has been successfully saved.');
  }));

  it('should show error message if saving fails for whatever reason', fakeAsync(() => {
    // mock error
    todoServiceFake.setListReturnValue = throwError('API error...');

    initComponentInNewState();

    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
        name: 'My Listname',
        description: '42',
        bgColor: '#111111'
    });

    component.onSave();

    tick(); // flush the component's setTimeout()
    fixture.detectChanges(); // update after SetTimeout

    expect(toastr.error).toHaveBeenCalledWith('Ops. Sorry, something went wrong. :(');
  }));

  it('should redirect to matrix view of a list.', fakeAsync(() => {

    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'));
        
    initComponentInNewState();


    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', DateTime.utc(2021, 1, 22), DateTime.utc(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
       name: 'My Listname',
       description: '42',
       bgColor: '#111111'
    });

    component.onSave();
    fixture.detectChanges();
    tick();
    expect(navigationService.navigate).toHaveBeenCalledWith(['', 'matrix', '6a93632e-0e04-47ea-bd7f-619862a71c30']);
  }));

});
