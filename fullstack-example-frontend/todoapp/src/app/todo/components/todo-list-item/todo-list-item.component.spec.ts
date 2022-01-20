import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoViewListItem } from '../todo-view-list-item';
import { v4 as uuidv4 } from 'uuid';
import { TodoListItemComponent } from './todo-list-item.component';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

describe('TodoListItemComponent', () => {
  let component: TodoListItemComponent;
  let fixture: ComponentFixture<TodoListItemComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCheckboxModule
      ],
      declarations: [ TodoListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListItemComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to propagate marked as done event.', async () => {
    // arrange
    const spyDoneChangedNext = spyOn(component.doneChanged, 'next');
    const viewItem = new TodoViewListItem('important task x', uuidv4(), false, 'Project W', '#fff', '');
    component.item = viewItem;
    fixture.detectChanges();

    // act
    const doneMatCheckboxHarness = await loader.getHarness(MatCheckboxHarness.with({}));
    await doneMatCheckboxHarness.check();

    // assert
    const expectedViewItem = new TodoViewListItem('important task x', viewItem.id, true, 'Project W', '#fff', '');
    expect(spyDoneChangedNext).toHaveBeenCalledWith(expectedViewItem);
  });
});
