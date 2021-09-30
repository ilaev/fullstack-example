import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMatrixQuadrantComponent } from './todo-matrix-quadrant.component';

describe('TodoMatrixQuadrantComponent', () => {
  let component: TodoMatrixQuadrantComponent;
  let fixture: ComponentFixture<TodoMatrixQuadrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoMatrixQuadrantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoMatrixQuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
