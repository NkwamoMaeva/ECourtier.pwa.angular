import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../@models/transaction';
import { Observable } from 'rxjs';
import { Insurer } from '../@models/insurer';
import { ContentHeaderService } from '../@services/content-header.service';
import {TransactionService} from '../@services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  sommeDue = 0;
  sommeRegle = 0;
  sommeTotal = 0 ;
  sommeTotal2 = 0;
  sommeTotalUnpaid = 0;
  lastTransactions: Transaction[];
  lastInsurersPaiements: Insurer[];
  handsetMatches: boolean;
  private cards: Observable<({ noHeader: boolean; color: string; rows: number; title: string; cols: number; content: string } | { noHeader: boolean; color: string; rows: number; title: string; cols: number; content: string } | { noHeader: boolean; color: string; rows: number; title: string; cols: number; content: string } | { noHeader: boolean; color: string; rows: number; title: string; cols: number; content: string })[]>;


  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private contentHeaderService: ContentHeaderService ,
    private  transactionservice: TransactionService,
    private router: Router) { }
  ngOnInit(): void {

    this.route.data
      .subscribe((data: { lastInsurersPaiements: Insurer[], lastTransactions: Transaction[] }) => {

        if (!data || !data.lastInsurersPaiements["data"]) { return; }

        for (const elt of data.lastInsurersPaiements["data"]) {
          this.sommeDue += parseInt(elt.dues.toString());
          this.sommeRegle += parseInt(elt.regles.toString());
        }
        this.lastTransactions = data.lastTransactions;
        this.lastInsurersPaiements = data.lastInsurersPaiements["data"];
      });
    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => this.fillCardData(matches)));
    this.contentHeaderService.contentHeader$.next({
      showTitle: true,
      title: 'Tableau de bord',
      endDateFilter: null,
      startDateFilter: null,
      hideHeader: false,
      showDateFilters: true
    });
    console.log(this.lastTransactions);

  }
getTotalAmount() {
    let item;
   return   this.transactionservice.getsTotal().subscribe(response => {
    this.sommeTotal2 = response["data"]["amount"];
     item = localStorage.getItem('amount');
     if (item == null){
       localStorage.setItem('amount', this.sommeTotal2.toString());
     }else {
       localStorage.removeItem('amount');
       localStorage.setItem('amount', this.sommeTotal2.toString());
     }
    });
  }

  getTotalUnpaid() {
    let item;
    return this.transactionservice.getsTotalUnpaid().subscribe(response => {
      this.sommeTotalUnpaid = response["data"]["amount"];
      item = localStorage.getItem('unpaid');
      if (item == null){
        localStorage.setItem('unpaid', this.sommeTotalUnpaid.toString());
      }else {
        localStorage.removeItem('unpaid');
        localStorage.setItem('unpaid', this.sommeTotalUnpaid.toString());
      }
    }); }



  fillCardData(matches: boolean) {
    let total ;
    let totalUnpaid
   this.getTotalAmount();
   this.getTotalUnpaid();
   total = localStorage.getItem('amount');
   totalUnpaid = localStorage.getItem('unpaid');
    this.handsetMatches = matches;
    return [
      { cols: !matches ? 1 : 4, rows: 1, color: 'first', noHeader: true, content: this.convertNumber(total), title: 'Montant dû tous assureurs' },
      { cols: !matches ? 1 : 4, rows: 1, color: 'second', noHeader: true, content: '0.00', title: 'Montant payé non listé' },
      { cols: !matches ? 1 : 4, rows: 1, color: 'third', noHeader: true, content: this.convertNumber(this.sommeRegle), title: 'Montant payé tous assureurs' },
      { cols: !matches ? 1 : 4, rows: 1, color: 'fourth', noHeader: true, content: this.convertNumber(totalUnpaid), title: 'Montant non payé' }
    ];
  }
  convertNumber(num) {
    return Math.round(num).toFixed(2);
  }
  showDetail(element) {
    localStorage.setItem('filterTransac',element)
    this.router.navigateByUrl('/transactions')
  }
}
