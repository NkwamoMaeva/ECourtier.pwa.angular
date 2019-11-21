import { Injectable } from '@angular/core';



import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insurer } from '../@models/insurer';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { ResponseRequest } from '../@models/responseRequest';

@Injectable({
    providedIn: 'root'
})
export class InsurerService extends DataService {

    constructor(protected http: HttpClient, protected storage: StorageService, protected toastService: ToastService, protected loaderService: LoaderService) {
        super(http, storage, 'INSURERS', toastService, loaderService);
    }

    getInsurers(): Observable<ResponseRequest<Insurer[]>> {
        return this.get<ResponseRequest<Insurer[]>>('insurers');
    }

    add(formData: FormData) {
      return this.http.post(this._baseUrl + 'insurers', formData);
        // return this.post('insurer', formData);
    }
    update(id: string, formData: FormData) {
        return this.http.put(this._baseUrl +'insurers/' + id, formData);
    }
  deleteA(user) {
    return this.http.delete(this._baseUrl +'insurers/'+user.ids[0]+'?username='+user.username+'&password='+user.password);
  }
}
