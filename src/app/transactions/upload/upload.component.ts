import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../../@models/transaction';
import { TransactionService } from 'src/app/@services/transaction.service';
import { Insurer } from 'src/app/@models/insurer';
import { ToastService } from 'src/app/@services/toast.service';
import { StorageService } from 'src/app/@services/storage.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ContentHeaderService } from 'src/app/@services/content-header.service';
import { LoaderService } from 'src/app/@services/loader.service';
import { DatePipe } from '@angular/common';
import { TransactionData } from 'src/app/@models/transactionData';

@Component({
  selector: 'app-transaction-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [DatePipe]
})
export class TransactionsUploadComponent implements OnInit {
  type: any;
  readyToSend: boolean;
  fichierTransaction;
  insurers: Insurer[];
  file: any;
  insurer: any;
  myDate = new Date();
  reference: string;
  commission;
  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private transaction: TransactionService,
    private toast: ToastService,
    private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TransactionsUploadComponent>,
    private loaderService: LoaderService,
    private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.insurers = this.data.insurers;
    this.activeroute.data
      .subscribe((data: { transactionData: TransactionData, insurers: Insurer[] }) => {
        if (!data || !data.transactionData) { return; }
        this.data = data.transactionData.data;
        this.reference = data.transactionData.reference;
      });
  }
  close() {
    this.dialogRef.close('closing');
  }
  setFile(element: { target: { files: any[]; }; }) {
    this.file = element.target.files[0];
    this.readyToSend = true;
    console.log(this.file);
  }
  refresh() {
    this.redirectTo([this.router.url]);
  }
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }
  upload(select: string | number, selectType: number) {
    if (typeof select === 'undefined' || select == null) {
      this.toast.push({
        text: 'Selectionnez un assureur',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (typeof selectType === 'undefined' || selectType == null) {
      this.toast.push({
        text: 'Selectionnez un type de transaction',
        persit: false,
        timeout: 3000
      });
      return;
    }
    this.toast.push({
      text: 'Traitement du fichier en cours',
      persit: false,
      timeout: 3000
    });
    // this.loaderService.loaderState$.next(true);
    const formData = new FormData();
    formData.append('transactionFile', this.file, this.file.name);
    formData.append('transactionType', this.type);
    formData.append('insurer', this.insurers[select].designation);
    formData.append('idInsurer', this.insurers[select].id);
    
    this.transaction.uploadT(formData)   
      .subscribe((response) => {
        console.log(response)
        this.fichierTransaction = response;
        this.storage.set('transit', JSON.stringify(this.fichierTransaction));
        this.toast.push({
          text: 'Affichage pour traitement',
          persit: false,
          timeout: 3000
        });
        this.dialogRef.close();
        if(this.file.type =='application/pdf'){
          this.refresh;

        }
        else{
          this.router.navigate(['/transactions', 'add']);

        }
      });
      
  }

    add(select: string | number, selectType: number,commission:number) {
      let timeNumber = String(new Date().getTime());
      let pos = timeNumber.length - 6;
    if (typeof select === 'undefined' || select == null) {
      this.toast.push({
        text: 'Selectionnez un assureur',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (typeof selectType === 'undefined' || selectType == null) {
      this.toast.push({
        text: 'Selectionnez un type de transaction',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (typeof commission === 'undefined' || commission == null) {
      this.toast.push({
        text: 'Entrer le montant de la commission',
        persit: false,
        timeout: 3000
      });
      return;
    }
    let eltToUpdate;
    let valueToUpdate;
      this.insurers.forEach(element => {
        if (element.id === this.insurers[select].id) {
          if (this.type === 1) {
            eltToUpdate = 'regles';
          } else {
            eltToUpdate = 'dues';
          }
          valueToUpdate = element[eltToUpdate] + this.commission;
        }
      });
    const user = JSON.parse(localStorage.getItem('CONNECTED_USER'));
    this.reference=''.concat(this.type, timeNumber.substring(pos));
    const t = {
      idInsurer: this.insurers[select].id,
      idTransaction_type: this.type,
      reference: this.reference,
      amount: commission,
      last_update: this.myDate,
      creation_date: this.myDate,
      idUser: user.id,
      "path_file": this.file.path_file,
      "data_file": JSON.stringify(this.data),
      eltToUpdate,
      valueToUpdate,
      columns: null
    };
    console.log(this.myDate)
    this.transaction.addT(t)
    .subscribe((res: any) => {
      if (res.error || res.err) {
        this.toast.push({
          persit: false,
          timeout: 5000,
          text: res.error || res.err
        });
      } else {
        this.toast.push({
          persit: false,
          timeout: 5000,
          text: 'Enregistrement effectué'
        });
        this.dialogRef.close();
        this.router.navigate(['/transactions']);
      }

    });
      
  }


}

@Component({
  selector: 'app-transaction-upload-dialog',
  template: ``
})
export class TransactionUploadDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    private contentHeaderService: ContentHeaderService
  ) {

  }

  ngOnInit() {
    this.contentHeaderService.contentHeader$.next({
      showTitle: false,
      title: '',
      endDateFilter: undefined,
      startDateFilter: undefined,
      hideHeader: false,
      showDateFilters: false
    });
    this.route.data
      .subscribe((data: { insurers: Insurer[] }) => {
        if (!data || !data.insurers) { return; }
        this.openDialog(data);
      });
    const elt = document.getElementsByClassName('cdk-overlay-pane');
    if (elt && elt.length > 0) {
      elt[0].classList.add('fullscreen');
    }
  }
  openDialog(data: { insurers: Insurer[]; }): void {
    const dialogRef = this.dialog.open(TransactionsUploadComponent, {
      minWidth: '250px',
      data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if (result === 'closing') {
        window.history.back();
      }
    });
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
