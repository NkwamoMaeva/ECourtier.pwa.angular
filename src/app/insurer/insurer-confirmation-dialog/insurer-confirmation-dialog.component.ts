import { element } from 'protractor';
import { InsurerComponent } from './../insurer.component';
import { User } from './../../@models/user';
import { AuthService } from './../../@services/auth.service';
import { Insurer } from './../../@models/insurer';
import { Component, OnInit, Input } from '@angular/core';
import { ErrorStateMatcher, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { InsurerService } from 'src/app/@services/insurer.service';
import { TransactionService } from 'src/app/@services/transaction.service';
import { Transaction } from 'src/app/@models/transaction';



@Component({
  selector: 'app-insurer-confirmation-dialog',
  templateUrl: './insurer-confirmation-dialog.component.html',
  styleUrls: ['./insurer-confirmation-dialog.component.scss'],
  providers:[TransactionService]
})


export class InsurerConfirmationDialogComponent implements OnInit {

  user: User;
  transactions: Transaction[];
  submitted = false;
  registerForm: FormGroup;
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private insurerService: InsurerService,
    private transactionService: TransactionService
  ) {
    this.user = auth.ConnectedUser;
    
  }
  returnUrl: string;
  selection = new SelectionModel<Insurer>(true, []);
  ngOnInit() {

    console.log(this.auth.ConnectedUser['username']);
    //this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.getTransactions();

  }
  
  refresh() {
    this.redirectTo([this.router.url]);

  }
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }

  deleteInsureur(ids: number[] | undefined) {
    const selectedId = ids || [];
    if (selectedId.length === 0) {
      const selected = this.selection.selected;

      selected.forEach(elt => {
        selectedId.push(elt.id);
      });
    }
    this.insurerService.deleteA(selectedId).subscribe(res => {
      this.refresh();
    });
  }

  delete(checked:boolean){
    console.log(this.transactions)
    this.submitted = true;

    
    let id = localStorage.getItem('idDeleteInsurer')
    let ids=[]
    let trans = [];
    ids.push(id)
          
    if(!checked){
      this.dialog.closeAll();
      this.deleteInsureur(ids);
    }
    else if(checked){
      this.dialog.closeAll();
      this.deleteInsureur(ids);
      if(this.transactions !== undefined){
      this.transactions.forEach(function(element){
        console.log(element)
        if(element['insurer'] == null || element['insurer'] == undefined){

        }
        else if(element['insurer']['id'] == id){
          trans.push(element.id);
        }
      })
      
      this.deleteTransactions(trans);
      
    }
    }

  }

  showDetail(element: any) {
    localStorage.setItem('assurer',JSON.stringify(element))
    this.router.navigateByUrl('/transactions')
  }

  deleteTransactions(ids: number[] | undefined) {
    
    const selectedId = ids || [];
    if (selectedId.length === 0) {
      const selected = this.selection.selected;
      selected.forEach(elt => {
        selectedId.push(elt.id);
      });
    }
    this.transactionService.deleteT(selectedId).subscribe(res => {
    });
  }

  getTransactions(){
    this.transactionService.getsT()
    .subscribe(transactions => this.transactions = transactions);
  }



}
