import { User } from './../../models';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUserDataService } from '../interfaces/i-user-data-service';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class InMemoryUserDataService implements IUserDataService {

  public getCurrentUser(): Observable<User> {
    return of(new User(uuid(), "test@inmemory.com", "testuser", DateTime.utc(2022, 1, 1), DateTime.utc(2022, 1, 1)));
  }

}