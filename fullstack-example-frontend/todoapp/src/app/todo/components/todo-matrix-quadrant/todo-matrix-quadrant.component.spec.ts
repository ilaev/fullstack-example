import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HarnessLoader } from '@angular/cdk/testing';
import { TodoQuadrantItem } from './todo-quadrant-item';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoMatrixQuadrantComponent } from './todo-matrix-quadrant.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListOptionHarness, MatSelectionListHarness } from '@angular/material/list/testing';
import { MatListModule } from '@angular/material/list';
import { MatButtonHarness } from '@angular/material/button/testing';

function generateQuadrantItems(): TodoQuadrantItem[] {
  const result: TodoQuadrantItem[] = [];
  const item1 = new TodoQuadrantItem("ccb6fb0f-f55e-4f1d-89c1-43b10f377eb8", "important task 1", 'really');
  const item2 = new TodoQuadrantItem("862feca0-ad5e-4168-b1a0-f36a8ef50793", "important task 2", 'really');
  
  result.push(item1);
  result.push(item2);
  return result;
}

describe('TodoMatrixQuadrantComponent', () => {
  let component: TodoMatrixQuadrantComponent;
  let fixture: ComponentFixture<TodoMatrixQuadrantComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatIconModule,
        MatButtonModule
      ],
      declarations: [ TodoMatrixQuadrantComponent ],
      providers: [
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoMatrixQuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided items for this quadrant.', async () => {
    component.items = generateQuadrantItems();
    fixture.detectChanges();
    const itemListHarness = await loader.getHarness(MatSelectionListHarness);
    const options = await itemListHarness.getItems();
    expect(options.length).toEqual(2);
    expect(await options[0].getText()).toEqual("important task 1edit");
  });

  it('should emit event on edit when the edit has been clicked.', async () => {
    const editEmitSpy = spyOn(component.edited, 'emit');
    component.items = generateQuadrantItems();
    fixture.detectChanges();

    const todoItemOptionHarness = await loader.getHarness(MatListOptionHarness.with( { text: 'important task 2edit' }));
    const editButtonHarness = await todoItemOptionHarness.getHarness(MatButtonHarness.with({ text: 'edit'}));
    await editButtonHarness.click();

    expect(editEmitSpy).toHaveBeenCalledWith(component.items[1]);
  });

  it(' should emit event on marked when checkbox has been clicked.', async () => {
    const markedEmitSpy = spyOn(component.marked, 'emit');
    component.items = generateQuadrantItems();
    
    fixture.detectChanges();
    const todoItemOptionHarness = await loader.getHarness(MatListOptionHarness.with( { text: 'important task 2edit' }));
    await todoItemOptionHarness.select();

    const mostRecentCall = markedEmitSpy.calls.mostRecent();
    expect(mostRecentCall.args[0]).toEqual([component.items[1]]);   
  });

});
