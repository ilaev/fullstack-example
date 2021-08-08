import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoRootComponent } from './components/todo-root/todo-root.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    TodoRootComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ]
})
export class TodoModule { }
