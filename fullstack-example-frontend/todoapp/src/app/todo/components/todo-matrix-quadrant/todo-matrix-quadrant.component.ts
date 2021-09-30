import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoQuadrantItem } from './todo-quadrant-item';



@Component({
  selector: 'app-todo-matrix-quadrant',
  templateUrl: './todo-matrix-quadrant.component.html',
  styleUrls: ['./todo-matrix-quadrant.component.scss']
})
export class TodoMatrixQuadrantComponent implements OnInit {

  @Input() items: TodoQuadrantItem[] | undefined;
  @Output() marked: EventEmitter<TodoQuadrantItem> = new EventEmitter<TodoQuadrantItem>();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    console.log('');
  }

  public edit($event: MouseEvent, todoItemId: string): void {
    $event.stopPropagation();
    // TODO: centralize navigation
    this.router.navigate(['/tasks/', todoItemId], {relativeTo: this.route }); 
    console.log('edit: ', $event);
  }

}
