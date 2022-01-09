import { ITodoNavigator } from 'src/app/todo';
import { TODO_NAVIGATOR_TOKEN } from './../../navigation/todo-navigator-token';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-root',
  templateUrl: './todo-root.component.html',
  styleUrls: ['./todo-root.component.scss']
})
export class TodoRootComponent implements OnInit {

  constructor(@Inject(TODO_NAVIGATOR_TOKEN) private navigator: ITodoNavigator) { }

  ngOnInit(): void {
    // make sure sidenav is always open.
    this.navigator.navigationEndEvents.subscribe({
      next: (event) => {
        const isSidenavActive = this.navigator.isSidenavActive();
        if (!isSidenavActive) 
          this.navigator.switchSidebarOn();
      }
    });
  }
}
