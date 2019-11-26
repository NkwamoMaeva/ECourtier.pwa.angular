import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {ToastService} from './toast.service';
import {LoaderService} from './loader.service';
import {Observable} from 'rxjs';
import {User} from '../@models/user';
import {ResponseRequest} from '../@models/responseRequest';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {
  constructor(
    protected http: HttpClient,
    protected storage: StorageService,
    protected toastService: ToastService,
    protected auth: AuthService,
    protected loaderService: LoaderService) {
    super(http, storage, 'Users', toastService, loaderService);
  }
  // @ts-ignore
  getUsers(): Observable<ResponseRequest<User>> {
    return this.get<ResponseRequest<User>>('users');
  }
  add(formData: FormData) {
    return this.http.post(this._baseUrl + 'auth/register', formData);
  }
  addUser(user: User): Observable<ResponseRequest<User>> {
    return this.http.post<ResponseRequest<User>>(this._baseUrl + 'auth/register', {
      user
    });
  }
  update(id: string, user: User): Observable<ResponseRequest<User>> {
    return this.put<ResponseRequest<User>>('user/' + id, user);
  }
  deleteA(ids): Observable<ResponseRequest<User>> {
    return this.delete('user/' + ids);
  }
  deleteUser(id: number, username: string, password: string): Observable<ResponseRequest<User>> {
    return this.delete<ResponseRequest<User>>('user/' + id + '?username=' + username + '&password=' + password);
  }
}
