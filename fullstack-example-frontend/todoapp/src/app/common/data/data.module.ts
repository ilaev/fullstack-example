import { LogService } from './../log';
import { UserDataService } from './services/user-data.service';
import { TodoDataService } from './services/todo-data.service';
import { DataApiSettings } from './data-api-settings';
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN, ApiModule, API_LOGGER_INJECTION_TOKEN } from '../api';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiModule.forChild()
  ],
  providers: [
    TodoDataService,
    UserDataService
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
    }

    return {
      ngModule: DataModule,
      providers: [
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: apiSettings },
        { provide: API_LOGGER_INJECTION_TOKEN, useClass: LogService }
      ]
    }
  }

  static forChild(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: [
      ]
    }
  }
}
