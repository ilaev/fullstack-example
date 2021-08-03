import { UserApiService } from './../../api';
import { User } from './../../models';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { transformUserDTO } from '../transform/transform-userdto';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private _cache: ReplaySubject<User> | undefined;
  constructor(private userApiService: UserApiService) {
  }

  public getCurrentUser(): Observable<User> {
    if (this._cache) {
      return this._cache.asObservable()
    } else {
      return this.userApiService.getCurrentUser().pipe(
        switchMap((userDTO: any) => {
          this._cache = new ReplaySubject<User>(1);
          this._cache.next(transformUserDTO(userDTO))
          return this._cache.asObservable();
        })
      )
    }
  }
}
