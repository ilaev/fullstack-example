import { TodoRootComponentsModule } from './components/todo-root-components.module';
import { AppComponent } from './components/app/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataModule } from '../common/data';
import { DATA_SETTINGS } from '../settings/data-api-settings';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TODO_NAVIGATOR_TOKEN } from '../todo';
import { NavigationService } from './services/navigation.service';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      autoDismiss: true,
      preventDuplicates: true,
      timeOut: 7000,
      positionClass: 'toast-bottom-right'
    }),
    TodoRootComponentsModule,
    DataModule.forRoot(DATA_SETTINGS)
  ],
  providers: [
    { provide: TODO_NAVIGATOR_TOKEN, useClass: NavigationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
