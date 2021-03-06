import { TODO_NAVIGATOR_TOKEN, ITodoNavigator } from 'src/app/todo';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatrixX, MatrixY, TodoItem, TodoList } from 'src/app/common/models';
import { ToastrService } from 'ngx-toastr';
import { ITodoDataService, TODO_DATA_SERVICE_INJECTION_TOKEN } from 'src/app/common/data';
import { SpinnerService } from './../../../root/services/spinner.service';
import { combineLatest, of, Subscription } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-todo-item-editor',
  templateUrl: './todo-item-editor.component.html',
  styleUrls: ['./todo-item-editor.component.scss']
})
export class TodoItemEditorComponent implements OnInit, OnDestroy {
  public todoLists: TodoList[] = [];
  public todoItem: TodoItem | undefined;
  public form: FormGroup | undefined;

  public headerTitle = '';
  public spinnerName = 'todoItemEditor';

  private _isRequestInProgress = false;
  public get isRequestInProgress(): boolean {
    return this._isRequestInProgress;
  }

  private subscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    @Inject(TODO_NAVIGATOR_TOKEN) private navigationService: ITodoNavigator,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    @Inject(TODO_DATA_SERVICE_INJECTION_TOKEN) private todoDataService: ITodoDataService
  ) {
    this.subscriptions = [];
  }

  private extractModelFromForm(todoItem: TodoItem, form: FormGroup): TodoItem {
    const name: string = form.get('name')?.value;
    const listId: string = form.get('listId')?.value;
    const matrixX: MatrixX = form.get('matrixX')?.value;
    const matrixY: MatrixY = form.get('matrixY')?.value;
    const note: string = form.get('note')?.value;
    const dueDate: DateTime = form.get('dueDate')?.value;
    const markedAsDone: boolean = form.get('markedAsDone')?.value;

    return new TodoItem(
      todoItem.id,
      listId,
      name,
      matrixX,
      matrixY,
      note,
      dueDate,
      todoItem.createdAt,
      todoItem.modifiedAt,
      todoItem.deletedAt,
      markedAsDone
    );
  }
  
  public createEmptyTodoItem(): TodoItem {
    return new TodoItem(
      '',
      null,
      '',
      MatrixX.NotUrgent,
      MatrixY.NotImportant,
      '',
      null,
      DateTime.now().toUTC(),
      DateTime.now().toUTC(),
      null,
      false
    );
  }

  public createForm(todoItem: TodoItem): FormGroup { 
    return new FormGroup({
      name: new FormControl(todoItem.name, [Validators.required]),
      listId: new FormControl(todoItem.listId),
      matrixX: new FormControl(todoItem.matrixX),
      matrixY: new FormControl(todoItem.matrixY),
      note: new FormControl(todoItem.note),
      dueDate: new FormControl(todoItem.dueDate),
      markedAsDone: new FormControl(todoItem.markedAsDone)
    });
  }

  public initComponent(todoItem: TodoItem, todoLists: TodoList[]): void {
    if (todoItem.id === '') {
      this.headerTitle = 'Add task';
    } else {
      this.headerTitle = 'Edit task';
    }
    this.todoLists = todoLists;
    this.todoItem = todoItem;
    this.form = this.createForm(todoItem);
  }

  ngOnInit(): void {
    const todoItemSub = this.route.paramMap.pipe(
      switchMap(paramMap => {
        const id = paramMap.get('id');
        if (id == null || id == 'new') {
          return combineLatest([
            of(this.createEmptyTodoItem()),
            this.todoDataService.getLists()
          ]);
        } else {
          this.activateSpinner();
          return combineLatest([
            this.todoDataService.getTodoItem(id),
            this.todoDataService.getLists()
          ]);
        }
      })).subscribe({
        next: ([todoItem, todoLists]) => {
          this.deactivateSpinner();
          this.initComponent(todoItem ? todoItem : this.createEmptyTodoItem(), todoLists);
        }, 
        error: (err) => {
          this.deactivateSpinner();
          this.toastr.error('A task with the provided id could not have been loaded...');
        }
      });
    this.subscriptions.push(todoItemSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // TODO: base abstract class? or at least an interface.
  // TODO: header component should be a common component
  // TODO: do above when we get another component which uses the same functionality
  public activateSpinner(): Promise<unknown> {
    this._isRequestInProgress = true;
    return this.spinnerService.show(this.spinnerName);
  }

  public deactivateSpinner(): Promise<unknown> {
    this._isRequestInProgress = false;
    return this.spinnerService.hide(this.spinnerName);
  }

  public areThereChangesBetweenFormAndItem(): boolean {
    if (this.todoItem && this.form) {
      const currentItemFromForm = this.extractModelFromForm(this.todoItem, this.form);
      const areItemsEqual = currentItemFromForm.equals(this.todoItem);
      return !areItemsEqual;
    }
    return false;
  }

  public isSaveDisabled(): boolean {
    return this.form?.invalid || !this.areThereChangesBetweenFormAndItem();
  }

  public onCancel(): void {
    this.navigationService.back();
  }

  public onSave(): void {
    if (this.form && this.todoItem && !this.isSaveDisabled()) {
      const todoItemToSave = this.extractModelFromForm(this.todoItem, this.form);
      this.activateSpinner();
      this.todoDataService.setTodoItem(todoItemToSave).pipe(first()).subscribe({
        next: (result) => {
          // TODO: reset component after save to 'new' state?
          this.initComponent(this.createEmptyTodoItem(), this.todoLists);
          this.toastr.success('Item saved.');
          this.deactivateSpinner();
        },
        error: (err) => {
          this.deactivateSpinner();
          this.toastr.error('Ups, sorry! :( Something went wrong, try again later.');
        }
      });
    }
  }

}
