import {
    Injectable
} from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from '../@models/transaction';
import { TransactionService } from '../@services/transaction.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class LastTransactionsResolverService implements Resolve<Transaction[]> {

    constructor(private transactionService: TransactionService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction[]> | never {
        return this.transactionService.getsT().pipe(map(trans => {
            console.log(trans);
            if (trans && trans.length) {
                return trans.slice(0, 5);
            } else {
                return null;
            }
        }));
    }
}

@Injectable({
    providedIn: 'root'
})
export class TransactionsResolverService implements Resolve<Transaction[]> {

    constructor(private transactionService: TransactionService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction[]> | never {
        return this.transactionService.getsT();
    }
}
