import { LogService } from './../log';
import { UserDataService } from './services/user-data.service';
import { TodoDataService } from './services/todo-data.service';
import { DataApiSettings } from './data-api-settings';
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN, ApiModule, API_LOGGER_INJECTION_TOKEN } from '../api';
import { LicenseService } from './services/license.service';
import { TODO_DATA_SERVICE_INJECTION_TOKEN } from './interfaces/todo-data-service-injection-token';
import { InMemoryTodoDataService } from './services/inmemory-todo-data.service';
import { USER_DATA_SERVICE_INJECTION_TOKEN } from './interfaces/user-data-service-injection-token';
import { InMemoryUserDataService } from './services/inmemory-user-data.service';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiModule.forChild()
  ],
  providers: [
    LicenseService
  ]
})
export class DataModule {
  constructor(@Optional() @SkipSelf() parentModule?: DataModule) {
    if (parentModule) {
      throw new Error('DataModule is already loaded. Import it in the root module only.');
    }
  }

  static forRoot(dataSettings: DataApiSettings): ModuleWithProviders<DataModule> {
    // hide web api module from rest of the app.
    const apiSettings: TodoApiSettings = {
      todoApiUri: dataSettings.todoApiUri
    };
    let todoDataServiceProvider = null;
    let userDataServiceProvider = null;
    if (dataSettings.useInMemoryServices) {
      todoDataServiceProvider = { provide: TODO_DATA_SERVICE_INJECTION_TOKEN, useClass: InMemoryTodoDataService };
      userDataServiceProvider = { provide: USER_DATA_SERVICE_INJECTION_TOKEN, useClass: InMemoryUserDataService };
    } else {
      todoDataServiceProvider = { provide: TODO_DATA_SERVICE_INJECTION_TOKEN, useClass: TodoDataService };
      userDataServiceProvider = { provide: USER_DATA_SERVICE_INJECTION_TOKEN, useClass: UserDataService };
    }
    return {
      ngModule: DataModule,
      providers: [
        todoDataServiceProvider,
        userDataServiceProvider,
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: apiSettings },
        { provide: API_LOGGER_INJECTION_TOKEN, useClass: LogService }
      ]
    };
  }

  static forChild(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: [
      ]
    };
  }
}
