import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@models/user';
import { Transaction } from 'src/app/@models/transaction';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/@services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TransactionService } from 'src/app/@services/transaction.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MyErrorStateMatcher } from 'src/app/insurer/insurer-confirmation-dialog/insurer-confirmation-dialog.component';

@Component({
  selector: 'app-transaction-confirmation-dialog',
  templateUrl: './transaction-confirmation-dialog.component.html',
  styleUrls: ['./transaction-confirmation-dialog.component.scss']
})
export class TransactionConfirmationDialogComponent implements OnInit {

  user;
  password;
  transactions: Transaction[];
  submitted = false;
  registerForm: FormGroup;
  id: String = localStorage.getItem('idDeleteTransaction');
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) { this.user = auth.ConnectedUser;}
  returnUrl: string;
  selection = new SelectionModel<Transaction>(true, []);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    this.user = this.user["data"];
   
  }

    
  refresh() {
    this.redirectTo([this.router.url]);

  }
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }

  deleteTransactions(ids: number[] | undefined) {   
    const selectedId = ids || [];
    console.log(this.id);
    if (selectedId.length === 0) {
      const selected = this.selection.selected;

      selected.forEach(elt => {
        selectedId.push(elt.id);
      });
    }
    const u={
      ids:selectedId,
      username:this.user["username"],
      password:this.password
    }
    console.log(u);
    this.transactionService.deleteT(u).subscribe(res => {
      this.dialog.closeAll();
      this.refresh();
    });
  }

}
