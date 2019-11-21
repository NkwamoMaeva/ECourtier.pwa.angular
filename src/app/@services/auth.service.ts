import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../@models/user';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  constructor(
    protected http: HttpClient,
    protected storage: StorageService,
    protected toastService: ToastService,
    protected loaderService: LoaderService) {
    super(http, storage, 'CONNECTED_USER', toastService, loaderService);

  }
  public get ConnectedUser(): User {
    return this.storage.getObject<User>(this.localStorageKey);
  }

  login(username: string, password: string) {
    return this.post<User>('auth/login', { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        // if (user && user.id) {
        // console.log(user);
        // store user details and jwt to+ken in local storage to keep user logged in between page refreshes
        this.storage.set(this.localStorageKey, user);
        // }
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    this.storage.remove(this.localStorageKey);
  }
}
