import {
    Injectable
} from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from '../@models/transaction';
import { TransactionService } from '../@services/transaction.service';
import { map } from 'rxjs/operators';
import { Insurer } from '../@models/insurer';
import { InsurerService } from '../@services/insurer.service';
import { ResponseRequest } from '../@models/responseRequest';

@Injectable({
    providedIn: 'root'
})
export class InsurerResolverService implements Resolve<ResponseRequest<Insurer[]>> {

    constructor(private insurerService: InsurerService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseRequest<Insurer[]>> | never {
        return this.insurerService.getInsurers();
    }
}
