import { TODO_ROUTING_PATH_SIDENAV } from './todo-routing-path';
import { ROUTER_OUTLET_SIDENAV } from './router-outlets';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TodoRootComponent } from './components/todo-root/todo-root.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TodoRootComponent,
    children: [
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
