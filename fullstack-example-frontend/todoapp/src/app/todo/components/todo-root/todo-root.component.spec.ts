import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoRootComponent } from './todo-root.component';

describe('TodoRootComponent', () => {
  let component: TodoRootComponent;
  let fixture: ComponentFixture<TodoRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
