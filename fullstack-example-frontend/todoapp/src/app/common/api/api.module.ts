import { ApiErrorHandler } from './api-error-handler';
import { TodoApiService } from './services/todo-api.service';
import { UserApiService } from './services/user-api.service';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN } from './todo-api-settings';
import { ModuleWithProviders, NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    UserApiService,
    TodoApiService,
    ApiErrorHandler
  ]
})
export class ApiModule {
  // TODO: test whether HttpClientModule can be included more than once.
  constructor(@Optional() @SkipSelf() parentModule?: ApiModule) {
    if (parentModule) {
      throw new Error(
        'ApiModule is already loaded. Import it in the root module only.'
      )
    }
  }

  static forRoot(apiSettings: TodoApiSettings): ModuleWithProviders<ApiModule> {
    const providers: Provider[] = [
      { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: apiSettings }
    ]

    return {
      ngModule: ApiModule,
      providers: providers
    }
  }

  /** called by feature modules */
  static forChild(): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: []
    }
  }
}
