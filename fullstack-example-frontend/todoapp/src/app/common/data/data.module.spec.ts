import { API_LOGGER_INJECTION_TOKEN, TODO_API_SETTINGS_INJECTION_TOKEN } from '../api';
import { LogService } from '../log';
import { DataApiSettings } from './data-api-settings';
import { DataModule } from './data.module';

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

  it('it should return module with providers to be used in the root module of an application.', () => {
    const dataSettings: DataApiSettings = {
        todoApiUri: 'https://localhost:4444/api/'
    };
    const forRootModule = DataModule.forRoot(dataSettings);

    expect(forRootModule).toBeDefined();
    expect(forRootModule.ngModule).toEqual(DataModule);
    expect(forRootModule.providers).toEqual([
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: dataSettings },
        { provide: API_LOGGER_INJECTION_TOKEN, useClass: LogService }
    ]);
  });


});


  
