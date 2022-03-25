import { InMemoryTodoDataService } from './services/inmemory-todo-data.service';
import { TODO_DATA_SERVICE_INJECTION_TOKEN } from './interfaces/todo-data-service-injection-token';
import { API_LOGGER_INJECTION_TOKEN, TODO_API_SETTINGS_INJECTION_TOKEN } from '../api';
import { LogService } from '../log';
import { DataApiSettings } from './data-api-settings';
import { DataModule } from './data.module';
import { USER_DATA_SERVICE_INJECTION_TOKEN } from './interfaces/user-data-service-injection-token';
import { InMemoryUserDataService } from './services/inmemory-user-data.service';
import { TodoDataService } from './services/todo-data.service';
import { UserDataService } from './services/user-data.service';

describe('DataModule', () => {

  it('should be able to create instance.', () => {
    expect(new DataModule()).toBeTruthy();
  });

  it('should throw an error if module is already loaded by using angular\'s dependency mechasimn and injecting the module into itself.', () => {
     try {
        new DataModule(new DataModule());
     } catch (e) {
        expect(e ).toBeDefined();
        expect((e as Error).message).toEqual('DataModule is already loaded. Import it in the root module only.');
     }
  });

  it('it should return module with providers to be used in child modules of an application.', () => {
    const forChildModule = DataModule.forChild();

    expect(forChildModule).toBeDefined();
    expect(forChildModule.ngModule).toEqual(DataModule);
    expect(forChildModule.providers).toEqual([]);
  });

  it('it should return module with providers to be used in the root module of an application if in-memory is enabled.', () => {
    const dataSettings: DataApiSettings = {
        todoApiUri: 'https://localhost:4444/api/',
        useInMemoryServices: true
    };
    const forRootModule = DataModule.forRoot(dataSettings);

    expect(forRootModule).toBeDefined();
    expect(forRootModule.ngModule).toEqual(DataModule);
    expect(forRootModule.providers).toEqual([
        { provide: TODO_DATA_SERVICE_INJECTION_TOKEN, useClass: InMemoryTodoDataService },
        { provide: USER_DATA_SERVICE_INJECTION_TOKEN, useClass: InMemoryUserDataService },
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: { todoApiUri: 'https://localhost:4444/api/' } },
        { provide: API_LOGGER_INJECTION_TOKEN, useClass: LogService }
    ]);
  });

  it('it should return module with providers to be used in the root module of an application if in-memory is disabled.', () => {
    const dataSettings: DataApiSettings = {
        todoApiUri: 'https://localhost:4444/api/',
        useInMemoryServices: false
    };
    const forRootModule = DataModule.forRoot(dataSettings);

    expect(forRootModule).toBeDefined();
    expect(forRootModule.ngModule).toEqual(DataModule);
    expect(forRootModule.providers).toEqual([
        { provide: TODO_DATA_SERVICE_INJECTION_TOKEN, useClass: TodoDataService },
        { provide: USER_DATA_SERVICE_INJECTION_TOKEN, useClass: UserDataService },
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: { todoApiUri: 'https://localhost:4444/api/' } },
        { provide: API_LOGGER_INJECTION_TOKEN, useClass: LogService }
    ]);
  });


});


  
