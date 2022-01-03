import { TodoViewListItem } from './../todo-view-list-item';
import { TODO_MATRIX_KIND_ID, TODO_QUERY_PARAM_MATRIX_Y, TODO_QUERY_PARAM_MATRIX_X } from './../../todo-routing-path';
import { combineLatest, Subscription, of } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, map, switchMap } from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';
import { MatrixX, MatrixY, TodoItem, TodoList } from 'src/app/common/models';
import { TodoDataService } from 'src/app/common/data';
import { filterItemsByMatrixKind } from '../../filters';
import { MATRIX_KIND } from '../../matrix-kind';
import { DateTime } from 'luxon';
import { NavigationService } from 'src/app/root/services/navigation.service';
import { ToastrService } from 'ngx-toastr';



interface ExtractedParams {
  matrixKindId: string;
  isCustomUserList: boolean;
  matrixY: MatrixY | undefined;
  matrixX: MatrixX | undefined;
}
@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss']
})
export class TodoListViewComponent implements OnInit, OnDestroy {
  public title = '';
  public subtitle = '';
  public headerBgColor = '#3b82f6';
  public userListId = '';
  public todoViewListItems: TodoViewListItem[] = [];
  private subscriptions: Subscription[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private todoDataService: TodoDataService,
    private navigationService: NavigationService,
    private toastr: ToastrService
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {

    const $params = combineLatest([ this.activatedRoute.paramMap, this.activatedRoute.queryParamMap ]).pipe(
      map(([paramMap, queryParamMap]) => {
        const matrixKindId = paramMap.get(TODO_MATRIX_KIND_ID) || '';
        
        const queryParamY = queryParamMap.get(TODO_QUERY_PARAM_MATRIX_Y);
        const parsedIntY = parseInt( queryParamY != null ? queryParamY : '');
        const matrixY: MatrixY | undefined = Number.isNaN(parsedIntY)  ? undefined : parsedIntY;
        const queryParamX = queryParamMap.get(TODO_QUERY_PARAM_MATRIX_X);
        const parsedIntX = parseInt( queryParamX != null ? queryParamX : '');
        const matrixX: MatrixX | undefined = Number.isNaN(parsedIntX) ? undefined : parsedIntX;

        const params: ExtractedParams = {
          isCustomUserList: uuidValidate(matrixKindId),
          matrixKindId: matrixKindId,
          matrixX: matrixX,
          matrixY: matrixY
        };
        return params;
      })
    );

    const listViewGenerationSub = $params.pipe(
      switchMap((extractedParams) => {
        if (extractedParams.isCustomUserList) {
          return combineLatest([
            of(extractedParams),
            this.todoDataService.getTodoItemsByListId(extractedParams.matrixKindId),
            this.todoDataService.getLists()
          ]);
        } else {
          return combineLatest([
            of(extractedParams),
            this.todoDataService.getTodoItems().pipe(map(items => filterItemsByMatrixKind(extractedParams.matrixKindId, items))),
            this.todoDataService.getLists()
          ]);
        }
      })
    ).subscribe({
      next: ([extractedParams, todoItems, todoLists]) => {
        this.initComponent(extractedParams, todoItems, todoLists);
      },
      error: (err) => {
        // TODO: generic view error handler
      }
    });

    this.subscriptions.push(listViewGenerationSub);

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private toStringMatrixCoords(matrixX: MatrixX, matrixY: MatrixY): string {
    if (matrixY === MatrixY.Important && matrixX === MatrixX.Urgent) {
      return "Important and urgent";
    } else if (matrixY === MatrixY.Important && matrixX === MatrixX.NotUrgent) {
      return 'Important and not urgent';
    } else if (matrixY === MatrixY.NotImportant && matrixX === MatrixX.Urgent) {
      return 'Urgent and not important';
    } else {
      return 'Not urgent and not important';
    }
  }
  
  private toStringMatrixKindId(matrixKindId: string): string {
    switch(matrixKindId) {
      case MATRIX_KIND.ALL: return 'All';
      case MATRIX_KIND.TODAY: return 'Today';
      case MATRIX_KIND.UPCOMING: return 'Upcoming';
      default: return '';
    }
  }

  private transformToTodoViewListItem(todoItem: TodoItem, listOfTodoItem: TodoList | undefined): TodoViewListItem {
    const dueDate = todoItem.dueDate ? todoItem.dueDate.toLocaleString(DateTime.DATE_MED) : '';
    return new TodoViewListItem(
      todoItem.name,
      todoItem.id,
      todoItem.markedAsDone,
      listOfTodoItem ? listOfTodoItem.name : '',
      listOfTodoItem ? listOfTodoItem.color : '',
      dueDate
    );
  }

  private initComponent(extractedParams: ExtractedParams, items: TodoItem[], todoLists: TodoList[]): void {
    if (uuidValidate(extractedParams.matrixKindId)) {
      this.userListId = extractedParams.matrixKindId;
      const list = todoLists.find(l => l.id === extractedParams.matrixKindId);
      this.title = list ? list.name : 'LIST NOT FOUND';
      this.headerBgColor = list ? list.color : this.headerBgColor;
    } else {
      this.title = this.toStringMatrixKindId(extractedParams.matrixKindId);
    }
    if (extractedParams.matrixX != null && extractedParams.matrixY != null)
      this.subtitle = this.toStringMatrixCoords(extractedParams.matrixX, extractedParams.matrixY);
    else
      this.subtitle = 'Displaying all items';
    
      if (items.length > 0) {
      let itemsToMap = items;
      if (extractedParams.matrixX != null && extractedParams.matrixY != null)
        itemsToMap = items.filter(i => i.matrixX === extractedParams.matrixX && i.matrixY === extractedParams.matrixY);
      
      this.todoViewListItems = itemsToMap.map(item => {
        let listOfItem: TodoList | undefined;
        if (item.listId != null)
          listOfItem = todoLists.find(list => list.id === item.listId);
        return this.transformToTodoViewListItem(item, listOfItem);
      });

    }
  }

  public onDoneChanged(item: TodoViewListItem): void {
    const changes: { [ key:string ]: boolean } = {};
    changes[item.id] = item.isDone;
    this.todoDataService.changeDoneStatusOfItems(changes).pipe(first()).subscribe();
  }

  public onBackBtnClick(): void {
    this.navigationService.back();
  }

  public showAllItems(): void {
    const params: Params = {};
    params[TODO_QUERY_PARAM_MATRIX_X] = null;
    params[TODO_QUERY_PARAM_MATRIX_Y] = null;
    const extras: NavigationExtras = { queryParams: params };
    extras.queryParamsHandling = 'merge';
    this.navigationService.navigate([], extras); 
  }

  public editList(): void {
    if (uuidValidate(this.userListId))
      this.navigationService.navigate(['lists/' + this.userListId]);
    else
      this.toastr.info('Only user created lists can be edited.');
  }
}
