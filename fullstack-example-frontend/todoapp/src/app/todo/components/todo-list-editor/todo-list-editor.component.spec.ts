import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListEditorComponent } from './todo-list-editor.component';

describe('TodoListEditorComponent', () => {
  let component: TodoListEditorComponent;
  let fixture: ComponentFixture<TodoListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoListEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
