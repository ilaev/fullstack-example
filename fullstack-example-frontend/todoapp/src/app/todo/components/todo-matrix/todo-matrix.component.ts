import { MATRIX_KIND } from './../../matrix-kind';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subscription } from 'rxjs';
import { TodoQuadrantItem } from './../todo-matrix-quadrant/todo-quadrant-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoDataService } from 'src/app/common/data';
import { MatrixX, MatrixY, TodoItem } from 'src/app/common/models';
import { TODO_MATRIX_KIND_ID } from '../../todo-routing-path';
import { getToday } from 'src/app/common/date-utility';


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
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.itemsImportantAndUrgent = [];
    this.itemsImportantAndNotUrgent = [];
    this.itemsUrgentAndNotImportant = [];
    this.itemsNotUrgentAndNotImportant = [];
    this.subscriptions = [];
  }

  private filterItemsByMatrixKind(matrixKindId: string, items: TodoItem[]): TodoItem[] {
    const today = getToday();
    switch (matrixKindId) {
      case MATRIX_KIND.ALL: 
        return items;
      case MATRIX_KIND.TODAY:
        return items.filter(i => {
          console.log(`${i.id}: ${i.dueDate}`);
          if (i.dueDate == null) {
            // for now show items without a duedate in today
            return true;
          } else {
            return i.dueDate?.equals(today);
          }
        });
      case MATRIX_KIND.UPCOMING:
        return items.filter(i => {
          if (i.dueDate == null) {
            // show withouts without duedate in upcoming
            return true;
          } else {
            return i.dueDate > today;
          }
        });
      default:
        // should only end up here if the user manually edits the url matrix param
        // I could add a validation so that I always have valid matrixKindId, but at the moment it's only used here
        // and if I don't use the matrixKindId anywhere else, it's not worth the time commitment
        return [];
    }
  }

  private initComponent(matrixKindId: string, items: TodoItem[]): void {
    const itemsToSplit = this.filterItemsByMatrixKind(matrixKindId, items);
    this.itemsImportantAndUrgent = itemsToSplit.filter(i => i.matrixY === MatrixY.Important && i.matrixX === MatrixX.Urgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsImportantAndNotUrgent = itemsToSplit.filter(i => i.matrixY === MatrixY.Important &&  i.matrixX === MatrixX.NotUrgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsUrgentAndNotImportant = itemsToSplit.filter(i => i.matrixX === MatrixX.Urgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
    this.itemsNotUrgentAndNotImportant = itemsToSplit.filter(i => i.matrixX === MatrixX.NotUrgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
  }

  ngOnInit(): void {
    const todoItemsSub = combineLatest([
      this.todoDataService.getTodoItems(),
      this.activatedRoute.paramMap
    ])
    .subscribe({
      next: ([items, paramMap]) => {
        const matrixKindId = paramMap.get(TODO_MATRIX_KIND_ID) || '';
        this.initComponent(matrixKindId, items ?? []);
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
