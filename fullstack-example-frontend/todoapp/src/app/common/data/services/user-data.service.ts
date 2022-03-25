import { UserDto } from './../../api';
import { UserApiService } from './../../api';
import { User } from './../../models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformFromUserDTO } from '../transform/transform-userdto';
import { IUserDataService } from '../interfaces/i-user-data-service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService implements IUserDataService {
  constructor(private userApiService: UserApiService) {
  }

  public getCurrentUser(): Observable<User> {
    return this.userApiService.getCurrentUser().pipe(
      map((userDto: UserDto) => {
        return transformFromUserDTO(userDto);
      }));
  }

}
