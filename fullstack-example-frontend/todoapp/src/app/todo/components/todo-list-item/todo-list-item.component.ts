import { TodoViewListItem } from './../todo-view-list-item';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent {
  @Input() item: TodoViewListItem | undefined;
  @Output() doneChanged = new EventEmitter<TodoViewListItem>();

  public onCheckboxChange(event: MatCheckboxChange, item: TodoViewListItem): void {
    item.isDone = event.checked;
    this.doneChanged.next(item);
  }
}
