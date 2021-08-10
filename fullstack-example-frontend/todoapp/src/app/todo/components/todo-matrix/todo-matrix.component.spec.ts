import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMatrixComponent } from './todo-matrix.component';

describe('TodoMatrixComponent', () => {
  let component: TodoMatrixComponent;
  let fixture: ComponentFixture<TodoMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoMatrixComponent ]
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
