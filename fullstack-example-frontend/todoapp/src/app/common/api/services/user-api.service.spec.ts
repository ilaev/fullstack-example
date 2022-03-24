import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { UserApiService } from './user-api.service';
import { TodoApiSettings, TODO_API_SETTINGS_INJECTION_TOKEN } from '../todo-api-settings';
import { ApiErrorHandler } from '../api-error-handler';

describe('UserApiService', () => {
  let service: UserApiService;
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
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user.', (done: DoneFn) => {
    service.getCurrentUser().subscribe({
      error: (err) => { done.fail();},
      next: (user) => {
        expect(user).toEqual({
          id: '960b9dbc-87c1-492c-b042-84d4dab14e9d',
          email: 'dwight.eisenhower@outlook.com',
          name: 'Dwight Eisenhower'
        });
        done();
      },
    });

    const req = httpMock.expectOne('http://localhost:4444/users/@me');
    expect(req.request.method).toBe('GET');

    req.flush({
      id: '960b9dbc-87c1-492c-b042-84d4dab14e9d',
      email: 'dwight.eisenhower@outlook.com',
      name: 'Dwight Eisenhower'
    });
    httpMock.verify();
  });

});
