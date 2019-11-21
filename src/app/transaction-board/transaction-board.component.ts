import {
  TransactionConfirmationDialogComponent
} from '../transactions/transaction-confirmation-dialog/transaction-confirmation-dialog.component';
import { transition } from '@angular/animations';
import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TransactionService } from '../@services/transaction.service';
import { Transaction } from '../@models/transaction';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { StorageService } from '../@services/storage.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { isNull } from 'util';

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
  selector: 'app-transaction-board',
  templateUrl: './transaction-board.component.html',
  styleUrls: ['./transaction-board.component.scss']
})
export class TransactionBoardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input('transactions') transactions: Transaction[];
  @Input('minimal') minimal: boolean;
  @Input('height') height: string;
  dataSource = new MatTableDataSource<Transaction>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('transacInput', { static: true }) transacInput: ElementRef;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  displayedColumns: string[];
  isSearch = false;
  selection = new SelectionModel<Transaction>(true, []);
  filterTransac;

  data_ilg = [
    'assets/pdf.png',
    'assets/xlsx.png',
  ];
  data_typeIC = [
    'assets/commission.png',
    'assets/slip.png',
  ];
  data_type = [
    'Bordereaux',
    'Commissions',
  ];
  selectedType = 'Tous';

  constructor(private router: Router, private storage: StorageService, private transactionService: TransactionService,private dialog: MatDialog,) {


  }

  ngOnInit() {
    // this.transactions.forEach(function(element) {
    //   this.allTransac.push(element['insurer']['short_name'])
    // });
    this.transactions = this.transactions["data"];
    if (this.minimal === false) {
      this.displayedColumns = ['select', 'reference', 'type', 'assureur', 'montant', 'date', 'genre', 'more-actions'];
    } else {
      this.displayedColumns = ['reference', 'type', 'assureur', 'montant', 'date', 'genre'];
    }
    this.dataSource = new MatTableDataSource(this.filterTransaction(this.transacs,this.transactions));

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  transacs: string = localStorage.getItem("filterTransac");

  refresh() {
    this.redirectTo([this.router.url]);
  }
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }

  edit(row) {
      localStorage.setItem('updateTransac', JSON.stringify(row));
      this.storage.set('transit', JSON.stringify(row));
      this.router.navigate(['/transactions', 'update']);
      
      console.log(row);
    
  }
  filterType(type: number) {
    if (type == 0) {
      this.dataSource = new MatTableDataSource(this.filterTransaction(this.transacs,this.transactions));
      this.ngAfterViewInit();
    } else {
      const trans = [];
      for(let i=0; i<this.transactions.length;i++){
        if(this.transactions[i]['transaction_type_id'] == type ){
          trans.push(this.transactions[i]);
        }

      };
      this.dataSource = new MatTableDataSource(this.filterTransaction(this.transacs,trans));
      this.ngAfterViewInit();

    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filterTransaction(filterValue , transaction){
    let filter=[];
    console.log(this.transacs);
    if(!this.transacs){
      return transaction;
    }
    else{

      for(let i=0; i<transaction.length;i++){
        if(transaction[i]['insurer_id'] == null){
        }
        else if(transaction[i]['insurer']['short_name'] == filterValue ){
          filter.push(transaction[i]);
        }

      };


      return filter;
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getTypeOfFile(path) {
    const ext = path.split('.')[path.split('.').length - 1];
    return ext.toLowerCase() == 'pdf' ? 0 : 1;
  }

  convertDate(date) {
    const mydate = new Date(date);
    const str = mydate.toDateString();
    return str;
  }

  openDialog(id){
    this.dialog.open(TransactionConfirmationDialogComponent);
    localStorage.setItem('idDeleteTransaction',id);
  }

  dowload(element){
    console.log(element)
    window.open('http://localhost:9001/'+element['files'][0]['path_file'], '_blank');
  }

}
