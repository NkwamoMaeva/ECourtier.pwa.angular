import { Component, OnInit } from '@angular/core';
import { User } from 'ecourtier.pwa.angular/src/app/@models/user';
import { Transaction } from 'ecourtier.pwa.angular/src/app/@models/transaction';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'ecourtier.pwa.angular/src/app/@services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TransactionService } from 'ecourtier.pwa.angular/src/app/@services/transaction.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-transaction-confirmation-dialog',
  templateUrl: './transaction-confirmation-dialog.component.html',
  styleUrls: ['./transaction-confirmation-dialog.component.scss']
})
export class TransactionConfirmationDialogComponent implements OnInit {

  user: User;
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

  ngOnInit() {
    console.log(this.auth.ConnectedUser['username']);
   
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
    this.transactionService.deleteT(selectedId).subscribe(res => {
      this.dialog.closeAll();
      this.refresh();
    });
  }

}
