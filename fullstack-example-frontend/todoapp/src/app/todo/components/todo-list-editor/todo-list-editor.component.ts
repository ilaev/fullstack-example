import { of, Subscription } from 'rxjs';
import { TodoList } from 'src/app/common/models';
import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoDataService } from 'src/app/common/data';
import { switchMap } from 'rxjs/operators';
import { SpinnerService } from 'src/app/root/services/spinner.service';

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

@Component({
  selector: 'app-todo-list-editor',
  templateUrl: './todo-list-editor.component.html',
  styleUrls: ['./todo-list-editor.component.scss']
})
export class TodoListEditorComponent implements OnInit, OnDestroy {
  public todoList: TodoList | undefined;
  public form: FormGroup | undefined;
  public spinnerName: string = 'todoListEditor';

  private _isRequestInProgress = false;
  public get isRequestInProgress() {
    return this._isRequestInProgress;
  };

  private subscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private todoService: TodoDataService,
    private spinnerService: SpinnerService
  ) {
    this.subscriptions = [];
  }

  private createEmptyTodoList(): TodoList {
    return new TodoList('', '', '', new Date(), new Date(), null, '');
  }

  private createForm(todoList: TodoList): FormGroup {
    return new FormGroup({
      name: new FormControl(todoList.name, [Validators.required]),
      description: new FormControl(todoList.description),
      bgColor: new FormControl(todoList.color)
    });
  }

  private extractModelFromForm(todoList: TodoList, form: FormGroup): TodoList {
    const name = form.get('name')?.value;
    const description = form.get('description')?.value;
    let color = form.get('bgColor')?.value;

    return new TodoList(
      todoList.id,
      name,
      description,
      todoList.createdAt,
      todoList.modifiedAt,
      todoList?.deletedAt,
      color
    );
  }

  private ensureExistenceOfColor(list: TodoList): TodoList {
    if (list.color !== '') {
      return list;
    } else {
      const colors = ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'];
      const selectedColor = colors[getRandomIntInclusive(0, colors.length - 1)];
      return new TodoList(
        list.id,
        list.name,
        list.description,
        list.createdAt,
        list.modifiedAt,
        list?.deletedAt,
        selectedColor
      );
    }
  }

  public activateSpinner(): Promise<unknown> {
    this._isRequestInProgress = true;
    return this.spinnerService.show(this.spinnerName);
  }

  public deactivateSpinner(): Promise<unknown> {
    this._isRequestInProgress = false;
    return this.spinnerService.hide(this.spinnerName);
  }

  ngOnInit(): void {
    // TODO: fix cancel. currently it redirect to the main route, but the main route doesn't open a default view
    // TODO: ExitGuard for this component.
    const getListSub = this.route.paramMap.pipe(
      switchMap(paramMap => {
        const id = paramMap.get('id'); // TODO: constant for id string, so w
        if (id == null || id === 'new') {
          return of(this.createEmptyTodoList());
        } else {
          this.activateSpinner();
          return this.todoService.getList(id);
        }
      })
    ).subscribe({
      next: (todoList) => {
        this.deactivateSpinner();
        this.initComponent(todoList ? todoList : this.createEmptyTodoList());
      },
      error: (err) => {
        this.deactivateSpinner();
        this.toastr.error('A list with the provided id does not exist.');
      }
    });

    this.subscriptions.push(getListSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public initComponent(todoList: TodoList) {
    this.todoList = todoList;
    this.form = this.createForm(todoList);
  }

  public onCancel(): void {
    this.router.navigate(['/']);
  }

  public isSaveDisabled(): boolean {
    return this.form?.invalid || !this.hasFormChanges();
  }

  public hasFormChanges(): boolean {
    if (this.todoList && this.form) {
      const currentList = this.extractModelFromForm(this.todoList, this.form);
      const areListsEqual = currentList.equals(this.todoList)
      return !areListsEqual;
    }
    return false;
  }

  public onSave(): void {
    if (this.todoList && this.form && !this.isSaveDisabled()) {
      const listToSave = this.ensureExistenceOfColor(this.extractModelFromForm(this.todoList, this.form));
      this.activateSpinner();
      this.todoService.setList(listToSave).subscribe({
        next: (result) => {
          // TODO: update component ( basically ngOnInit has to run once again) through refresh from server, since the is the source of truth.
          // this.todoList and form have to be updated with the new values. or maybe everything has to be emptied
          // because, how to you add a new list? what if a user wants to add a second list right after? not possible without clicking the + Add list button
          this.deactivateSpinner();
          this.toastr.success('List has been successfully saved.');
        },
        error: (err) => {
          this.deactivateSpinner();
          this.toastr.error('Ops. Sorry, something went wrong. :(');
        }
      });
    }
  }
}
