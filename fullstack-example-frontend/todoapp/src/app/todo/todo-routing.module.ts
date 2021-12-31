import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { TodoListEditorComponent } from './components/todo-list-editor/todo-list-editor.component';
import { TodoMatrixComponent } from './components/todo-matrix/todo-matrix.component';
import { TODO_MATRIX_KIND_ID, TODO_ROUTING_PATH_SIDENAV } from './todo-routing-path';
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
        path: 'matrix/:' + TODO_MATRIX_KIND_ID,
        component: TodoMatrixComponent
      },
      {
        path: 'list-view/:' + TODO_MATRIX_KIND_ID,
        component: TodoListViewComponent
      },
      {
        path: 'lists/:id',
        component: TodoListEditorComponent
      },
      {
        path: 'tasks/:id',
        component: TodoItemEditorComponent
      },
      {
        path: TODO_ROUTING_PATH_SIDENAV,
        outlet: ROUTER_OUTLET_SIDENAV,
        component: SidenavComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
