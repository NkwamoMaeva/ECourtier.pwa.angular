import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {User} from '../@models/user';
import {UserService} from '../@services/user.service';
import {Observable} from 'rxjs';
import {ResponseRequest} from '../@models/responseRequest';


@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<ResponseRequest<User>> {
  constructor(protected userService: UserService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    : Observable<ResponseRequest<User>>
    | Promise<ResponseRequest<User>>
    | ResponseRequest<User> {
    return this.userService.getUsers();
  }
}
