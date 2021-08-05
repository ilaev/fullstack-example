import { User } from './../../models/user';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserApiService } from '../../api';

import { UserDataService } from './user-data.service';

describe('UserDataService', () => {
  let service: UserDataService;

  beforeEach(() => {
    const userApiServiceSpy = jasmine.createSpyObj('UserApiService', {
      getCurrentUser: of({
        id: '960b9dbc-87c1-492c-b042-84d4dab14e9d',
        email: 'dwight.eisenhower@outlook.com',
        name: 'Dwight Eisenhower',
        avatar: 'placeholder',
        createdAt: '2021-08-01T21:45:13.982Z',
        modifiedAt: '2021-08-01T21:45:13.982Z',
      })
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
    service = TestBed.inject(UserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user model.', (done) => {
    service.getCurrentUser().subscribe({
      next: (user) => {
        expect(user instanceof User).toBeTrue();
        expect(user.id).toEqual('960b9dbc-87c1-492c-b042-84d4dab14e9d');
        done();
      }
    });
  });

});
