import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../@models/transaction';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { Insurer } from '../@models/insurer';
import { LoaderService } from './loader.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { SemesterRangeService } from './semester-range.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService extends DataService {


    constructor(protected http: HttpClient,
                protected storage: StorageService,
                protected toastService: ToastService,
                protected loaderService: LoaderService,
                protected semesterRangeService: SemesterRangeService) {
        super(http, storage, 'TRANSACTIONS', toastService, loaderService);
    }

    uploadT(formData: FormData) {
        return this.http.post(this._baseUrl + 'transactions/files', formData);
    }
    getsT(): Observable<Transaction[]> {
        return this.get<Transaction[]>('transactions');
    }
  getsTotal(): Observable<number> {
    return this.get<number>('amounts/paid');
  }
  getsTotalUnpaid(): Observable<number> {
    return this.get<number>('amounts/unpaid');
  }

    getT(id): Observable<Transaction[]> {
        return this.get('transactions/get/' + id);
    }

    addT(transaction) {
        return this.http.post(this._baseUrl + 'transactions', transaction);
    }
    updateT(id: string, transaction) {
        return this.http.put(this._baseUrl + 'transactions/' + id, transaction);
    }
    deleteT(user) {
        return this.http.delete(this._baseUrl +'transactions/'+user.ids[0]+'?username='+user.username+'&password='+user.password);
    }

    getTransactionByRange(startDate, endDate) {
        const newStart = this.getDateFormat(startDate);
        const newEnd = this.getDateFormat(endDate);
        console.log(newStart);
        console.log(newEnd);
        return this.get<Transaction[]>('transactions/' + newStart + '/' + newEnd);
    }
    getDateFormat(date) {
        let year;
        let month;
        let day;
        let h;
        let min;
        let s;
        year = date.getFullYear();
        month = parseInt(date.getMonth()) + 1 + '';
        month = month.length > 1 ? month : '0' + month;
        day = date.getDate() + '';
        day = day.length > 1 ? day : '0' + day;
        h = date.getHours() + '';
        h = h.length > 1 ? h : '0' + h;
        min = date.getMinutes() + '';
        min = min.length > 1 ? min : '0' + min;
        s = date.getSeconds() + '';
        s = s.length > 1 ? s : '0' + s;

        return year + '-' + month + '-' + day + ' ' + h + ':' + min + ':' + s;
    }
}
