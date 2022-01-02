import { MATRIX_KIND } from './../../matrix-kind';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subscription, of } from 'rxjs';
import { TodoQuadrantItem } from './../todo-matrix-quadrant/todo-quadrant-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoDataService } from 'src/app/common/data';
import { MatrixX, MatrixY, TodoItem } from 'src/app/common/models';
import { TODO_MATRIX_KIND_ID } from '../../todo-routing-path';
import { getToday } from 'src/app/common/date-utility';
import { first, map, switchMap } from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';

function transformToTodoQuadrantItem(item: TodoItem): TodoQuadrantItem {
  return new TodoQuadrantItem(item.id, item.name, item.note, item.markedAsDone);
}
@Component({
  selector: 'app-todo-matrix',
  templateUrl: './todo-matrix.component.html',
  styleUrls: ['./todo-matrix.component.scss']
})
export class TodoMatrixComponent implements OnInit, OnDestroy {
  public MATRIX_X = MatrixX;
  public MATRIX_Y = MatrixY;
  public id = '';
  public itemsImportantAndUrgent: TodoQuadrantItem[];
  public itemsImportantAndNotUrgent: TodoQuadrantItem[];
  public itemsUrgentAndNotImportant: TodoQuadrantItem[];
  public itemsNotUrgentAndNotImportant: TodoQuadrantItem[];  

  public selectedItemsMap = new Map<string, string>();
  private subscriptions: Subscription[];

  constructor(
    private todoDataService: TodoDataService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
    this.selectedItemsMap.clear();
    this.id = matrixKindId;
    this.itemsImportantAndUrgent = items.filter(i => i.matrixY === MatrixY.Important && i.matrixX === MatrixX.Urgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsImportantAndNotUrgent = items.filter(i => i.matrixY === MatrixY.Important &&  i.matrixX === MatrixX.NotUrgent).map(i => transformToTodoQuadrantItem(i));
    this.itemsUrgentAndNotImportant = items.filter(i => i.matrixX === MatrixX.Urgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
    this.itemsNotUrgentAndNotImportant = items.filter(i => i.matrixX === MatrixX.NotUrgent && i.matrixY === MatrixY.NotImportant).map(i => transformToTodoQuadrantItem(i));
  }

  ngOnInit(): void {
    const todoItemsSub = this.activatedRoute.paramMap.pipe(
      switchMap((paramMap) => {
        const matrixKindId = paramMap.get(TODO_MATRIX_KIND_ID) || '';
        if (uuidValidate(matrixKindId)) {
          return combineLatest([
            of(matrixKindId),
            this.todoDataService.getTodoItemsByListId(matrixKindId)
          ]);
        } else {
          return  combineLatest([
            of(matrixKindId),
            this.todoDataService.getTodoItems().pipe(
              map((items) => this.filterItemsByMatrixKind(matrixKindId, items)))
          ]);
        }
      })
    ).subscribe({
      next: ([matrixKindId, items]) => {
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

  public onEdit(quadrantItem: TodoQuadrantItem): void {
    // TODO: centralize navigation
    this.router.navigate(['/tasks/', quadrantItem.id], {relativeTo: this.activatedRoute }); 
  }

  public onMarked(quadrantItems: TodoQuadrantItem[]): void {
    quadrantItems.forEach((quadrantItem => {
      if (!this.selectedItemsMap.has(quadrantItem.id)) {
        this.selectedItemsMap.set(quadrantItem.id, quadrantItem.id);
      } else {
        this.selectedItemsMap.delete(quadrantItem.id);
      }
    }));
  }

  public markSelectedAsDone(): void {
    const changes: { [key: string]: boolean } = {};
    this.selectedItemsMap.forEach((value, key) => {
      changes[key] = true;
    });
    this.todoDataService.changeDoneStatusOfItems(changes).pipe(first()).subscribe();
  }

  public markSelectedAsUnDone(): void {
    const changes: { [ key: string]: boolean } = {};
    this.selectedItemsMap.forEach((value, key) => {
      changes[key] = false;
    });

    this.todoDataService.changeDoneStatusOfItems(changes).pipe(first()).subscribe();
  }
}
