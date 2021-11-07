import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatLuxonDateModule, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoRootComponent } from './components/todo-root/todo-root.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatDividerModule } from '@angular/material/divider';
import { TodoMatrixComponent } from './components/todo-matrix/todo-matrix.component';
import { TodoListEditorComponent } from './components/todo-list-editor/todo-list-editor.component';
import { TodoItemEditorComponent } from './components/todo-item-editor/todo-item-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorCircleModule } from 'ngx-color/circle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TodoMatrixQuadrantComponent } from './components/todo-matrix-quadrant/todo-matrix-quadrant.component';
import { Settings } from 'luxon';
import { DATE_LOCALE } from '../common/date-locale';


@NgModule({
  declarations: [
    TodoRootComponent,
    SidenavComponent,
    TodoMatrixComponent,
    TodoListEditorComponent,
    TodoItemEditorComponent,
    TodoMatrixQuadrantComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    ReactiveFormsModule,
    ColorCircleModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatLuxonDateModule,  // NOTE: if I want a different starting week, I have to extend LuxonDateAdapter and override the getFirstDayOfWeek method. Will be necessary for german language
    MatSelectModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: DATE_LOCALE.EN_GB },
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TodoModule { 
  constructor(){
    Settings.defaultLocale = DATE_LOCALE.EN_GB;
  }
}
