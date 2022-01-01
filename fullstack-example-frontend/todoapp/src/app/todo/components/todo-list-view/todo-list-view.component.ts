import { TodoViewListItem } from './../todo-view-list-item';
import { TODO_MATRIX_KIND_ID, TODO_QUERY_PARAM_MATRIX_Y, TODO_QUERY_PARAM_MATRIX_X } from './../../todo-routing-path';
import { combineLatest, Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';
import { MatrixX, MatrixY, TodoItem, TodoList } from 'src/app/common/models';
import { TodoDataService } from 'src/app/common/data';
import { filterItemsByMatrixKind } from '../../filters';
import { MATRIX_KIND } from '../../matrix-kind';
import { DateTime } from 'luxon';



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
  public title = ''
  public subtitle = '';
  public headerBgColor = '#3b82f6';
  public todoViewListItems: TodoViewListItem[] = [];
  private subscriptions: Subscription[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private todoDataService: TodoDataService
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {

    const $params = combineLatest([ this.activatedRoute.paramMap, this.activatedRoute.queryParamMap ]).pipe(
      map(([paramMap, queryParamMap]) => {
        console.log('paramMap', paramMap);
        console.log('queryParamMap: ', queryParamMap);
        const matrixKindId = paramMap.get(TODO_MATRIX_KIND_ID) || '';
        
        const parsedIntY = parseInt(queryParamMap.get(TODO_QUERY_PARAM_MATRIX_Y) || '');
        const matrixY: MatrixY | undefined = Number.isNaN(parsedIntY)  ? undefined : parsedIntY;
        const parsedIntX = parseInt(queryParamMap.get(TODO_QUERY_PARAM_MATRIX_X) || '');
        const matrixX: MatrixX | undefined = Number.isNaN(parsedIntX) ? undefined : parsedIntX;

        console.log(`${matrixKindId}`);
        const params: ExtractedParams = {
          isCustomUserList: uuidValidate(matrixKindId),
          matrixKindId: matrixKindId,
          matrixX: matrixX,
          matrixY: matrixY
        };
        console.log('extractedparams: ', params)
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
      listOfTodoItem ? listOfTodoItem.name : '',
      listOfTodoItem ? listOfTodoItem.color : '',
      dueDate
    );
  }

  private initComponent(extractedParams: ExtractedParams, items: TodoItem[], todoLists: TodoList[]): void {
    if (uuidValidate(extractedParams.matrixKindId)) {
      const list = todoLists.find(l => l.id === extractedParams.matrixKindId);
      this.title = list ? list.name : 'LIST NOT FOUND';
      this.headerBgColor = list ? list.color : this.headerBgColor;
    } else {
      this.title = this.toStringMatrixKindId(extractedParams.matrixKindId);
    }
    // TODO: this component should be able to display everything from matrixkindid or list
    // so subtitle will be removed?
    if (extractedParams.matrixX != null && extractedParams.matrixY != null)
      this.subtitle = this.toStringMatrixCoords(extractedParams.matrixX, extractedParams.matrixY);
    else
      this.subtitle = 'Displaying all items';
    
    if (items.length > 0) {
      // TODO: if no matrixY and matrixX are provided, we shall display everything
      // TODO: filter by matrixX and matrixY
      let itemsToMap = items;
      if (extractedParams.matrixX != null && extractedParams.matrixY != null)
        itemsToMap = items.filter(i => i.matrixX === extractedParams.matrixX && i.matrixY === extractedParams.matrixY);
      
      this.todoViewListItems = itemsToMap.map(item => {
        let listOfItem: TodoList | undefined;
        if (item.listId != null)
          listOfItem = todoLists.find(list => list.id === item.listId);
        return this.transformToTodoViewListItem(item, listOfItem);
      });

      console.log('mappeditems: ', items, this.todoViewListItems)
    }

  }
}
