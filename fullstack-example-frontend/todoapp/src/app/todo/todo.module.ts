import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoRootComponent } from './components/todo-root/todo-root.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatDividerModule } from '@angular/material/divider';
import { TodoMatrixComponent } from './components/todo-matrix/todo-matrix.component';
import { TodoListEditorComponent } from './components/todo-list-editor/todo-list-editor.component';
import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';


@NgModule({
  declarations: [
    TodoRootComponent,
    SidenavComponent,
    TodoMatrixComponent,
    TodoListEditorComponent,
    TodoItemEditorComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ]
})
export class TodoModule { }
