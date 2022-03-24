import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN } from '../todo-api-settings';
import { TodoApiService } from './todo-api.service';
import { ApiErrorHandler } from '../api-error-handler';

describe('TodoApiService', () => {
  let service: TodoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const apiSettings: TodoApiSettings = {
      todoApiUri: 'http://localhost:4444'
    };
    const apiErrorHandlerSpy = jasmine.createSpyObj('ApiErrorHandler', ['handleError']);
  
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: TODO_API_SETTINGS_INJECTION_TOKEN, useValue: apiSettings },
        { provide: ApiErrorHandler,  useValue: apiErrorHandlerSpy }
      ]
    });
    service = TestBed.inject(TodoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
