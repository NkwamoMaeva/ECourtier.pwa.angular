import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {ToastService} from './toast.service';
import {LoaderService} from './loader.service';
import {Observable} from 'rxjs';
import {User} from '../@models/user';
import {ResponseRequest} from '../@models/responseRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {
  constructor(
    protected http: HttpClient,
    protected storage: StorageService,
    protected toastService: ToastService,
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
  update(id: string, user: User) {
    return this.post('/' + id, user);
  }
  deleteA(ids) {
    return this.post('/delete',{
      id: ids
    });
  }
}
