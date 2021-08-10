import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListEditorComponent } from './todo-list-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TodoListEditorComponent', () => {
  let component: TodoListEditorComponent;
  let fixture: ComponentFixture<TodoListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ],
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
