import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TransactionService } from '../../@services/transaction.service';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Transaction } from '../../@models/transaction';
import { TransactionData } from 'src/app/@models/transactionData';
import { Insurer } from 'src/app/@models/insurer';
import { ContentHeaderService } from 'src/app/@services/content-header.service';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';

export interface mails {
  mail: string;
  status: number;
  expiration: string;
}

export interface numbers {
  numero: string;
  status: number;
  expiration: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-transaction-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TransactionsAddComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, public transaction: TransactionService, private dialog: MatDialog, private activeroute: ActivatedRoute, private router: Router, private contentHeaderService: ContentHeaderService) {
  }

  ELEMENT_CLASS = [
    'select',
    'unselect'
  ];

  META_DATA = [
    'COMMISSION',
    'CLIENT',
    'PRODUIT',
    'CONTRAT',
    'TAUX',
    'ASSUREUR'
  ];

  path: any;
  columns: string[];
  data: any;
  dataInsurer: any;
  commissionValue = 0;
  _key: string;
  rejectLine = 0;
  considerateLine = 0;
  commissionClass: boolean;
  HaveHeader: boolean;
  screen_size: number;

  style1: string;
  columnsOrigin: string[];
  index: number;
  insurer: string;
  typeTransaction: number;
  reference: string;
  action: string;
  idTransaction: string;
  numberOfRejected: number;
  startDay: Date;
  endDay: Date;

  idInsurer;
  columnCommissionIndex = null;

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.activeroute.data
      .subscribe((data: { transactionData: TransactionData, insurers: Insurer[] }) => {
        this.idInsurer = data.transactionData.idInsurer;

        if (!data || !data.transactionData) { return; }
        this.data = data.transactionData.data;
        this.path = data.transactionData.path;
        this.insurer = data.transactionData.insurer;
        this.idInsurer = data.transactionData.idInsurer;
        this.reference = data.transactionData.reference;
        this.typeTransaction = data.transactionData.typeTransaction;
        this.columns = data.transactionData.columns;
        this.columnsOrigin = data.transactionData.columnsOrigin;
        this.commissionValue = data.transactionData.commissionValue;
        this.idTransaction = data.transactionData.id;
        this.dataInsurer = data.insurers;
        this.action = data.transactionData.actionType;
        this.screen_size = window.outerWidth;
        this.checkEntete();
        this.commissionClass = false;
        this.startDay = data.transactionData.creationDate;
        this.endDay = data.transactionData.lastUpdate;
        this.contentHeaderService.contentHeader$.next({
          showTitle: true,
          title: this.getTtitle(),
          endDateFilter: undefined,
          startDateFilter: undefined,
          hideHeader: false,
          showDateFilters: false
        });
      });

    this.commissionClass = this.action == 'update';

    console.log(this.idInsurer)
  }
  setTitle() {
    this.contentHeaderService.contentHeader$.next({
      showTitle: true,
      title: this.getTtitle(),
      endDateFilter: undefined,
      startDateFilter: undefined,
      hideHeader: false,
      showDateFilters: false
    });
  }
  checkEntete() {
    for (let x = 0; x < this.data.length; x++) {
      if (this.data[x].HEAD == true) {
        this.HaveHeader = true;
        return;
      }
    }
  }
  checkAll(valeur) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].HEAD == false) {
        this.data[i].VALID = valeur;
      }
    }
    this.calculCommission();
  }
  check(element, forced = false) {
    if (forced == false) {
      element.VALID = !element.VALID;
    } else {
      element.VALID = !element.HEAD;
    }
    this.calculCommission();
  }
  clickForHeader(element) {
    for (let x = 0; x < this.data.length; x++) {
      this.data[x].HEAD = false;
    }
    const index = element['#'] - 1;
    this.data[index].HEAD = true;
    this.HaveHeader = true;
    this.check(element, true);
  }
  findEntete() {
    for (let x = 0; x < this.data.length; x++) {
      if (this.data[x].HEAD == true) {
        this.HaveHeader = true;
        return;
      }
    }
  }
  setNumOfReject() {
    this.rejectLine = 0;
    for (let x = 0; x < this.data.length; x++) {
      if (this.data[x].VALID == false) {
        this.rejectLine = this.rejectLine + 1;
      }
    }

    this.considerateLine = this.data.length - this.rejectLine;
    return this.rejectLine;
  }
  numberOfRejectedLine() {
    this.numberOfRejected = 0;
    for (let x = 0; x < this.data.length; x++) {
      if (this.data[x].VALID == false) {
        this.numberOfRejected++;
      }
    }
    this.considerateLine = this.data.length - this.numberOfRejected;
    return this.numberOfRejected;
  }
  checkIfHasHeader() {
    if (this.HaveHeader) {
      return 'OUI';
    } else {
      return 'NON';
    }
  }
  changeColumnColor(element, x) {
    const checked = element.VALID;
    const style1 = (checked ? this.ELEMENT_CLASS[0] : this.ELEMENT_CLASS[1]);
    const style2 = (this.commissionClass && x == this.columns[this.columns.length - 1] ? 'yellow' : '');
    return `${style1} ${style2}`;
  }
  setNumOfConsiderate() {
    return !!this.considerateLine ? this.considerateLine : '';
  }
  changeStatusStyle(element: { [x: string]: any; }, x: string) {
    const checked = element.VALID;
    const style1 = (checked ? this.ELEMENT_CLASS[0] : this.ELEMENT_CLASS[1]);
    const style2 = (this.commissionClass && x == this.columns[this.columns.length - 1] ? 'yellow' : '');
    return `${style1} ${style2}`;
  }

  selectedCommission(x: string) {
    return this.commissionClass && x == this.columns[this.columns.length - 1] ? 0 : null;
  }
  getTtitle() {
    if (this.action == 'update') {
      return 'Modifier une transaction de ' + (this.typeTransaction == 1 ? 'commission' : 'bordereau');
    } else {
      return 'Ajouter une transaction de ' + (this.typeTransaction == 1 ? 'commission' : 'bordereau');
    }
  }
  deleteHead() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].HEAD = false;
      this.HaveHeader = false;
    }
  }
  changeColumns(x, selectV) {
    const select = selectV.value;
    const aide = this.columns[x];
    if (this.META_DATA[select] === 'COMMISSION') {
      this.commissionClass = true;
      if (x !== this.columns.length - 1) {
        this.columns[x] = this.columns[this.columns.length - 1];
        this.columns[this.columns.length - 1] = aide;
      }
      this.columnCommissionIndex = this.columns.length - 1;
      this.index = this.columnsOrigin.indexOf(aide);
    } else if (this.META_DATA[select] != 'COMMISSION') {
      if (x == this.columns.length - 1) {
        this.commissionClass = false;
        selectV.value = select;
      }
    } else {
      this.commissionClass = false;
    }
    this.calculCommission();
  }

  save() {
    if (this.commissionClass === false) {
      this.dialog.open(WarnigDialogComponent);
    } else {
      const user = JSON.parse(localStorage.getItem('CONNECTED_USER'));
      let eltToUpdate;
      let valueToUpdate;
      this.dataInsurer.forEach(element => {
        if (element.id === this.idInsurer) {
          if (this.typeTransaction === 1) {
            eltToUpdate = 'regles';
          } else {
            eltToUpdate = 'dues';
          }
          valueToUpdate = element[eltToUpdate] + this.commissionValue;
        }
      });

      const t = {
        idInsurer: this.idInsurer,
        idTransaction_type: this.typeTransaction,
        reference: this.reference,
        amount: this.commissionValue,
        last_update: this.endDay,
        creation_date: this.startDay,
        idUser: user.id,
        path_file: this.path,
        data_file: JSON.stringify(this.data),
        eltToUpdate,
        valueToUpdate,
        columns: JSON.stringify(this.columns)
      };
      console.log('user  identify is' + user.id);
      if (this.action === 'add') {
        this.transaction.addT(t).subscribe((res: any) => {
          this.router.navigate(['/transactions']);
        });
      } else if (this.action === 'update') {
        this.transaction.updateT(this.idTransaction, t).subscribe((res: any) => {
          this.router.navigate(['/transactions']);
        });
      }
    }
  }

  calculCommission() {
    if (this.data === undefined || this.data.length < 1) {
      return 0.0;
    }
    const _columns = Object.getOwnPropertyNames(this.data[0]);
    const _index = this.columns[_columns.length - 1];

    let _commission = 0.0;
    for (const elt of this.data) {
      if (elt.VALID === true && elt.HEAD === false) {
        const num = parseInt(elt[_index], 0);
        if (!isNaN(num)) {
          _commission += num;
        }
      }
    }
    this.commissionValue = Math.round(_commission * 100) / 100;
  }

  annulation() {
    this.dialog.open(CancelDialogComponent, { data: { action: this.action } }).afterClosed().subscribe(res => {
      if (res === 'ok') {
        this.router.navigateByUrl('/transactions');
      }
    });
  }
}

@Component({
  selector: 'app-warning-dialog',
  template: `
    <div class="container">
      <div class="bloc-title">
          <div>Information</div>
      </div>
      <p>Opération impossible, veuillez choisir une colonne de commission</p>
      <div class="bloc-button">
          <button mat-button color="primary" mat-dialog-close>OK</button>
      </div>
    </div>
  `,
  styles: [`
  .bloc-button {
      text-align: right;
  }

  .bloc-title {
      font-size: 14px;
      font-weight: 600;
  }`]
})
export class WarnigDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
