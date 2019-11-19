import { Injectable } from '@angular/core';



import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insurer } from '../@models/insurer';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class InsurerService extends DataService {

    constructor(protected http: HttpClient, protected storage: StorageService, protected toastService: ToastService, protected loaderService: LoaderService) {
        super(http, storage, 'INSURERS', toastService, loaderService);
    }

    getInsurers(): Observable<Insurer[]> {
        return this.get<Insurer[]>('insurers');
    }

    add(formData: FormData) {
      return this.http.post(this._baseUrl + 'insurers', formData);
        // return this.post('insurer', formData);
    }
    update(id: string, insurer: Insurer) {
        return this.put('insurers/' + id, insurer);
    }
  deleteA(ids) {
    return this.post('insurers/delete', {
      id: ids
    });
  }
}
