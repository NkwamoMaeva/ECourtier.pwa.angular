import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {ToastService} from './toast.service';
import {LoaderService} from './loader.service';
import {Observable} from 'rxjs';
import {User} from '../@models/user';

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
  getUsers(): Observable<User[]> {
    return this.get<User[]>('');
  }
  add(formData: FormData) {
    return this.http.post(this._baseUrl + '/add', formData);
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
