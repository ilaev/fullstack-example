import { TodoCommonModule } from './../../common/components/todo-common.module';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AppComponent } from './app/app.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MainContainerComponent } from './main-container/main-container.component'
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainContainerComponent
  ],
  imports: [
    CommonModule,
    TodoCommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class TodoRootComponentsModule { }
