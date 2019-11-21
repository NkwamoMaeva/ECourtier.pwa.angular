import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TransactionService } from 'src/app/@services/transaction.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ContentHeaderService } from 'src/app/@services/content-header.service';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { WarnigDialogComponent } from '../add/add.component';

@Component({
  selector: 'app-transaction-update',
  templateUrl: './transaction-update.component.html',
  styleUrls: ['./transaction-update.component.scss']
})
export class TransactionUpdateComponent implements OnInit {


  constructor(private cdr: ChangeDetectorRef, public transaction: TransactionService, private dialog: MatDialog, private router: Router, private contentHeaderService: ContentHeaderService) { }
  action = 'update';
  element = JSON.parse(localStorage.getItem('updateTransac'));
  data = JSON.parse(this.element.file.data_file);

  path: any;
  columns: string[] = JSON.parse(this.element.file.columns);
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
  insurer = this.element.insurer;
  typeTransaction: number = this.element.transaction_type_id;
  reference: string = this.element.reference;
  idTransaction: string = this.element.id;
  numberOfRejected: number;
  startDay: Date = this.element.creation_date;
  endDay: Date = this.element.last_update;
  idInsurer = this.element.insurer_id;

  columnCommissionIndex = null;

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
  ngOnInit() {
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
      const user = JSON.parse(localStorage.getItem('CONNECTED_USER'))["data"];
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
        last_update: new Date(),
        creation_date: this.startDay,
        idUser: user.id,
        path_file: this.path,
        data_file: JSON.stringify(this.data),
        eltToUpdate,
        valueToUpdate,
        columns: this.columns
      };
      console.log(t);
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
