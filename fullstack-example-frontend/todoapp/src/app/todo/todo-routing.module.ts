import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { TodoListEditorComponent } from './components/todo-list-editor/todo-list-editor.component';
import { TodoMatrixComponent } from './components/todo-matrix/todo-matrix.component';
import { TODO_ROUTING_PATH_SIDENAV, TODO_ROUTING_PATH_TASK_EDITOR, TODO_ROUTING_PATH_LIST_EDITOR, TODO_ROUTING_PATH_LIST_VIEW, TODO_ROUTING_PATH_MATRIX_VIEW } from './todo-routing-path';
import { ROUTER_OUTLET_SIDENAV } from './router-outlets';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TodoRootComponent } from './components/todo-root/todo-root.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListViewComponent } from './components/todo-list-view/todo-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: TodoRootComponent,
    children: [
      {
        path: TODO_ROUTING_PATH_MATRIX_VIEW,
        component: TodoMatrixComponent
      },
      {
        path: TODO_ROUTING_PATH_LIST_VIEW,
        component: TodoListViewComponent
      },
      {
        path: TODO_ROUTING_PATH_LIST_EDITOR,
        component: TodoListEditorComponent
      },
      {
        path: TODO_ROUTING_PATH_TASK_EDITOR,
        component: TodoItemEditorComponent
      },
      {
        path: TODO_ROUTING_PATH_SIDENAV,
        outlet: ROUTER_OUTLET_SIDENAV,
        component: SidenavComponent
      },
      {
        path: '',
        redirectTo: 'matrix/today'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
