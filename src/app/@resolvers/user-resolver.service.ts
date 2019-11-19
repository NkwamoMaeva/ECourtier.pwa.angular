import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {User} from '../@models/user';
import {UserService} from '../@services/user.service';
import {Observable} from 'rxjs';
import {UserResult} from "../@models/UserResult";


@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<UserResult> {
  constructor(protected userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserResult> | Promise<UserResult> | UserResult {
    return this.userService.getUsers();
  }
}
