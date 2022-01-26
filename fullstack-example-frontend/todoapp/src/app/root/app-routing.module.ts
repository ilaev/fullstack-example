import { MainContainerComponent } from './components/main-container/main-container.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ABOUT_ROUTING_PATH } from './app-routing-path';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: ABOUT_ROUTING_PATH,
        component: AboutComponent
      },
      {
        path: '',
        loadChildren: () => import('../todo/todo.module').then(m => m.TodoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
