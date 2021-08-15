import { TodoList } from 'src/app/common/models';
import { throwError, Observable, of, ReplaySubject, EMPTY } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoListEditorComponent } from './todo-list-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoDataService } from 'src/app/common/data';
import { SpinnerService } from 'src/app/root/services/spinner.service';

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

  private color: string = '';
  private isDisabled: boolean = false;

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

  triggerChange(hex: string) {
    this.cbRegisterOnChange(hex);
    this.cbRegisterOnTouched(hex);
  }

  getColor(): string {
    return this.color;
  }
 
}

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  /** Set the paramMap observable's next value */
  setParamMap(params: Params = {}) {
    this.subject.next(convertToParamMap(params));
  }
}

class TodoServiceFake {
  public getListReturnValue: ReplaySubject<TodoList | undefined> = new ReplaySubject<TodoList | undefined>();
  public setListReturnValue: Observable<TodoList> = EMPTY;
  public getList(id: string): Observable<TodoList | undefined> {
    return this.getListReturnValue.asObservable();
  }
  public setGetListReturnValue(list: TodoList | undefined): void {
    this.getListReturnValue.next(list);
  }
  public setList(todoList: any): Observable<TodoList> {
    return this.setListReturnValue;
  }
}

describe('TodoListEditorComponent', () => {
  let component: TodoListEditorComponent;
  let fixture: ComponentFixture<TodoListEditorComponent>;
  let router: Router;
  let toastr: ToastrService;
  let todoService: TodoDataService;
  let spinnerService: SpinnerService;

  let todoServiceFake: TodoServiceFake;
  let routeStub: ActivatedRouteStub;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);

    todoServiceFake = new TodoServiceFake();
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
        { provide: Router, useValue: routerSpy },
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
    router = TestBed.inject(Router);
    toastr = TestBed.inject(ToastrService);
    todoService = TestBed.inject(TodoDataService);
    spinnerService = TestBed.inject(SpinnerService);
    component = fixture.componentInstance;
  });

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
    todoServiceFake.setGetListReturnValue( new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#121212'));
    routeStub.setParamMap({id: '6a93632e-0e04-47ea-bd7f-619862a71c30'});
    fixture.detectChanges();
    tick();

    expect(activateSpinnerSpy).toHaveBeenCalled();
    expect(deactivateSpinnerSpy).toHaveBeenCalled();
  }));

  it('should initialize component in creation state when route param id equals "new".', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    
    expect(todoService.getList).not.toHaveBeenCalled();
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('');
    expect(component.todoList).toBeDefined();
    expect(component.todoList?.id).toEqual('');
  }));

  it('should initialize component in creation state when route param id is non-existent.', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'unknown-id-01'});
    fixture.detectChanges();
    tick();


    const expectedTodoListId = 'unknown-id-01';
    expect(todoService.getList).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.form?.get('name')?.value).toEqual('');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('');
    expect(component.todoList).toBeDefined();
    expect(component.todoList?.id).toEqual('');
  }));

  it('should initialize component in edit state when route param is an existing id', fakeAsync(() => {
    spyOn(todoService, 'getList').and.callThrough();
    // init component
    todoServiceFake.setGetListReturnValue( new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#121212'));
    routeStub.setParamMap({id: '6a93632e-0e04-47ea-bd7f-619862a71c30'});
    fixture.detectChanges();
    tick();

    const expectedTodoListId = '6a93632e-0e04-47ea-bd7f-619862a71c30';
    expect(todoService.getList).toHaveBeenCalledWith(expectedTodoListId);
    expect(component.todoList?.id).toEqual(expectedTodoListId);
    expect(component.form?.get('name')?.value).toEqual('my list name');
    expect(component.form?.get('description')?.value).toEqual('');
    expect(component.form?.get('bgColor')?.value).toEqual('#121212');
  }));

  it('should disable the save button when form is invalid.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'})
    fixture.detectChanges();
    tick();


    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const saveBtnElement: HTMLButtonElement = btnDes[1].nativeElement;

    expect(saveBtnElement.disabled).toBeTruthy('should disable create button');
  }));

  it('should disable save button when there are no changes.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const saveBtnElement: HTMLButtonElement = btnDes[1].nativeElement;

    component.form?.patchValue({name: 'my list name'});
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '');

    fixture.detectChanges();

    expect(saveBtnElement.disabled).toBeTruthy();
  }));

  it('should enable save button when there are changes.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const saveBtnElement: HTMLButtonElement = btnDes[1].nativeElement;

    component.form?.patchValue({name: 'changed name'});
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'my list name', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '');

    fixture.detectChanges();

    expect(saveBtnElement.disabled).toBeFalsy();
  }));

  it('should display form validation errors in the UI.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    // simulate empty input input and touched
    component.form?.patchValue({name: ''});
    component.form?.get('name')?.markAsTouched();

    fixture.detectChanges();

    // search for mat-error element
    const nameRequiredErrorElem = fixture.debugElement.query(By.css('mat-error')).nativeElement as HTMLElement;

    expect(nameRequiredErrorElem.innerText).toEqual('You must enter a name.');
  }));

  it('should enable the save button when form is valid.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const saveBtnElement: HTMLButtonElement = btnDes[1].nativeElement;

    expect(saveBtnElement.disabled).toBeTruthy();

    component.form?.patchValue({name: 'My List 1'});

    fixture.detectChanges();

    expect(saveBtnElement.disabled).toBeFalsy();
  }));

  it('should be able to set a name of a list.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebugElement.nativeElement;

    inputElement.value = 'My List 1';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.form?.get('name')?.value).toEqual('My List 1');
  }));

  xit('should be able set a description of a list.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const textAreaDebugElement = fixture.debugElement.query(By.css('textarea'));
    const textAreaElement: HTMLTextAreaElement = textAreaDebugElement.nativeElement;


    const text = 'my description';
    for(var i = 0; i < text.length; i++){ 
  
      textAreaElement.dispatchEvent(new KeyboardEvent('keydown', { key: text[i], bubbles: true}));
      textAreaElement.dispatchEvent(new KeyboardEvent('keypress', { key: text[i], bubbles: true}));
      textAreaElement.value += text[i];
      textAreaElement.dispatchEvent(new KeyboardEvent('keyup', { key: text[i], bubbles: true}));
    }
    // TODO: can't get it to work at the moment, look at this later.
    expect(component.form?.get('description')?.value).toEqual('my description');
  }));

  it('should be able set a background color of a list.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const colorComponent = fixture.debugElement.query(By.css('color-circle')).injector.get(ColorCircleMockComponent);

    colorComponent.triggerChange('#808080')
    fixture.detectChanges();

    expect(component.form?.get('bgColor')?.value).toEqual('#808080')
  }));

  it('should display background color of a list.', fakeAsync(() => {
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const colorComponent = fixture.debugElement.query(By.css('color-circle')).injector.get(ColorCircleMockComponent);

    component.form?.patchValue({bgColor: '#020202'});
    fixture.detectChanges();

    expect(colorComponent.getColor()).toEqual('#020202')
  }));

  it('should be able to cancel', fakeAsync(() => {
    const onCancelSpy = spyOn(component, 'onCancel').and.callThrough();
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const cancelBtnElement: HTMLButtonElement = btnDes[0].nativeElement;

    cancelBtnElement.dispatchEvent(new Event('click'));

    expect(onCancelSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should be able to save a list.', fakeAsync(() => {
    const onSaveSpy = spyOn(component, 'onSave').and.callThrough();
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'));
    const setListSpy = spyOn(todoService, 'setList').and.callThrough();
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();

    const btnDes = fixture.debugElement.queryAll(By.css('form div button'));
    const saveBtnElement: HTMLButtonElement = btnDes[1].nativeElement;

    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'); 
    // set values to be saved
    component.form?.setValue({
      name: 'My Listname',
      description: '42',
      bgColor: '#111111'
    });

    saveBtnElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick();
    
    const expectedList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111');
    expect(onSaveSpy).toHaveBeenCalled();
    expect(setListSpy).toHaveBeenCalledWith(expectedList);
  }));


  it('should display saving progress indicator.', fakeAsync(() => {
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'));
    const activateSpinnerSpy = spyOn(component, 'activateSpinner');
    const deactivateSpinnerSpy = spyOn(component, 'deactivateSpinner');

    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'); 
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
    todoServiceFake.setListReturnValue = of( new TodoList('', 'My list name', '42', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#444444'));
    const setListSpy = spyOn(todoService, 'setList').and.callThrough();
        
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    // mock old list
    component.todoList = new TodoList('', '', '', new Date(2021, 1, 22), new Date(2021, 1, 22), null, ''); 
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
    todoServiceFake.setListReturnValue = of(new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My Listname', '42', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'));
        
    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'); 
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

    // init component
    todoServiceFake.setGetListReturnValue(undefined);
    routeStub.setParamMap({id: 'new'});
    fixture.detectChanges();
    tick();


    // mock old list
    component.todoList = new TodoList('6a93632e-0e04-47ea-bd7f-619862a71c30', 'My old listname', 'old description', new Date(2021, 1, 22), new Date(2021, 1, 22), null, '#111111'); 
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

  it('should update component\'s state after saving.', fakeAsync(() => {

  }));

});
