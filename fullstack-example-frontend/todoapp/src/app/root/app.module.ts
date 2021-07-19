import { TodoRootComponentsModule } from './components/todo-root-components.module';
import { AppComponent } from './components/app/app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TodoRootComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
