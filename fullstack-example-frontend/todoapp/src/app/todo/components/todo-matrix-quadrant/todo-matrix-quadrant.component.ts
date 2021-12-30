import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { TodoQuadrantItem } from './todo-quadrant-item';



@Component({
  selector: 'app-todo-matrix-quadrant',
  templateUrl: './todo-matrix-quadrant.component.html',
  styleUrls: ['./todo-matrix-quadrant.component.scss']
})
export class TodoMatrixQuadrantComponent {
  @Input() items: TodoQuadrantItem[] | undefined;
  @Output() marked: EventEmitter<TodoQuadrantItem[]> = new EventEmitter<TodoQuadrantItem[]>();
  @Output() edited: EventEmitter<TodoQuadrantItem> = new EventEmitter<TodoQuadrantItem>();

  public edit($event: MouseEvent, item: TodoQuadrantItem): void {
    $event.stopPropagation();
    this.edited.emit(item);
  }

  public onSelect($event: MatSelectionListChange): void {
    this.marked.emit($event.options.map(x => x.value));
  }

}
