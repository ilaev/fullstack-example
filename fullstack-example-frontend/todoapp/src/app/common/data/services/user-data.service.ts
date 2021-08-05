import { UserApiService } from './../../api';
import { User } from './../../models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformUserDTO } from '../transform/transform-userdto';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(private userApiService: UserApiService) {
  }

  public getCurrentUser(): Observable<User> {
    return this.userApiService.getCurrentUser().pipe(
      map((userDto: any) => {
        return transformUserDTO(userDto);
      }));
  }

}
