import { TodoRootComponentsModule } from './components/todo-root-components.module';
import { AppComponent } from './components/app/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataModule } from '../common/data';
import { DATA_SETTINGS } from '../settings/data-api-settings';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TodoRootComponentsModule,
    DataModule.forRoot(DATA_SETTINGS)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
