import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TodoQuadrantItem } from './../todo-matrix-quadrant/todo-quadrant-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoDataService } from 'src/app/common/data';
import { MatrixX, MatrixY, TodoItem } from 'src/app/common/models';


function transformToTodoQuadrantItem(item: TodoItem): TodoQuadrantItem {
  return new TodoQuadrantItem(item.id, item.name, item.note);
}
@Component({
  selector: 'app-todo-matrix',
  templateUrl: './todo-matrix.component.html',
  styleUrls: ['./todo-matrix.component.scss']
})
export class TodoMatrixComponent implements OnInit, OnDestroy {

  public itemsImportantAndUrgent: TodoQuadrantItem[];
  public itemsImportantAndNotUrgent: TodoQuadrantItem[];
  public itemsUrgentAndNotImportant: TodoQuadrantItem[];
  public itemsNotUrgentAndNotImportant: TodoQuadrantItem[];  

  private subscriptions: Subscription[];

  constructor(
    private todoDataService: TodoDataService,
    private toastr: ToastrService
  ) {
    this.itemsImportantAndUrgent = [];
    this.itemsImportantAndNotUrgent = [];
    this.itemsUrgentAndNotImportant = [];
    this.itemsNotUrgentAndNotImportant = [];
    this.subscriptions = [];
  }

  private initComponent(items: TodoItem[]): void {
    this.itemsImportantAndUrgent = items.filter(i => i.matrixY === MatrixY.Important && i.matrixX === MatrixX.Urgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsImportantAndNotUrgent = items.filter(i => i.matrixY === MatrixY.Important &&  i.matrixX === MatrixX.NotUrgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsUrgentAndNotImportant = items.filter(i => i.matrixX === MatrixX.Urgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
    this.itemsNotUrgentAndNotImportant = items.filter(i => i.matrixX === MatrixX.NotUrgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
  }

  ngOnInit(): void {
    const todoItemsSub = this.todoDataService.getTodoItems()
    .subscribe({
      next: (items) => {
        this.initComponent(items ?? []);
      },
      error: (err) => {
        this.toastr.error(err);
      }
    });
    this.subscriptions.push(todoItemsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( s => s.unsubscribe());
  }

}
