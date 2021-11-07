import { TodoDataService } from 'src/app/common/data';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMatrixComponent } from './todo-matrix.component';
import { ActivatedRouteStub, FakeTodoService } from 'src/app/testing';

describe('TodoMatrixComponent', () => {
  let component: TodoMatrixComponent;
  let fixture: ComponentFixture<TodoMatrixComponent>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    const activatedRouteStub = new ActivatedRouteStub();
    const todoDataServiceFake = new FakeTodoService(); 
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ TodoMatrixComponent ],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
