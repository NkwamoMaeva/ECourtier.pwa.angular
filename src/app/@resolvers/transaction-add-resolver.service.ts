import {
    Injectable
} from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from '../@models/transaction';
import { TransactionService } from '../@services/transaction.service';
import { map } from 'rxjs/operators';
import { StorageService } from '../@services/storage.service';
import { TransactionData } from '../@models/transactionData';


@Injectable({
    providedIn: 'root'
})
export class TransactionAddResolverService implements Resolve<TransactionData> {
    transactionService: any;

    constructor(private storage: StorageService, private router: Router) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TransactionData | never {
        const action = route.params.data;
        const transitData = this.storage.getObject('transit') as any;
        const transactionData = new TransactionData();
        transactionData.actionType = action;
        if (transitData != null) {
            if (action == 'add') {
                transactionData.data = transitData.dataFile;
                transactionData.path = transitData.filePath;
                transactionData.insurer = transitData.insurer;
                transactionData.idInsurer = transitData.idInsurer;
                transactionData.reference = transitData.reference;
                transactionData.typeTransaction = transitData.type;
                transactionData.lastUpdate = new Date();
                transactionData.creationDate = new Date();
                transactionData.columns = this.getColumns(transactionData.data);
                transactionData.columnsOrigin = this.getColumns(transactionData.data);
                transactionData.commissionValue = 0;
            } else if (action == 'update') {
                const newDataFile = JSON.parse(transitData.data_file.replace(/\|/g, '"'));
                transactionData.data = newDataFile;
                transactionData.path = transitData.path_file;
                transactionData.insurer = transitData.insurer;
                transactionData.idInsurer = transitData.idInsurer + '';
                transactionData.reference = transitData.reference;
                transactionData.typeTransaction = transitData.idTransaction_type;
                transactionData.lastUpdate = new Date();
                transactionData.creationDate = transitData.creation_date;
                const newColumns = JSON.parse(transitData.columns.replace(/\|/g, '"'));
                transactionData.columns = newColumns;
                transactionData.columnsOrigin = this.getColumns(transactionData.data);
                transactionData.commissionValue = transitData.amount;
            } else {
                this.router.navigate(['/not-found'], { queryParams: { returnUrl: state.url } });
            }
            transactionData.id = transitData.id;
        } else {
            this.router.navigate(['/not-found'], { queryParams: { returnUrl: state.url } });
        }
        return transactionData;
    }

    getColumns(data) {
        let id;
        for (const elt of data) {
            if (elt.HEAD === false && elt.VALID === true) {
                id = data.indexOf(elt);
                break;
            }
        }
        return Object.keys(data[id]);
    }
}
