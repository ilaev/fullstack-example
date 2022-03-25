import { Observable } from "rxjs";
import { User } from "../../models";

export interface IUserDataService {
    getCurrentUser(): Observable<User>;
}