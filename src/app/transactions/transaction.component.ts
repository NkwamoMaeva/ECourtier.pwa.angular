import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../@models/transaction';
import { ContentHeaderService } from '../@services/content-header.service';
import { SemesterRangeService } from '../@services/semester-range.service';
import { TransactionService } from '../@services/transaction.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[];

  fabButtons = [{
    text: 'Commisions',
    link: ['/transactions/upload', 'commission'],
    icon: 'keyboard_arrow_left'
  }, {
    text: 'Borderaux',
    link: ['/transactions/upload', 'bordereau'],
    icon: 'keyboard_arrow_right'
  }];
  constructor(private route: ActivatedRoute,
              private contentHeaderService: ContentHeaderService,
              private semesterRangeService: SemesterRangeService,
              private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { transactions: Transaction[] }) => {
        if (!data || !data.transactions) { return; }
        this.transactions = data.transactions;
      });
    this.contentHeaderService.contentHeader$.next({
      showTitle: true,
      title: 'Transactions',
      endDateFilter: null,
      startDateFilter: null,
      hideHeader: false,
      showDateFilters: true
    });
    this.semesterRangeService.semesterRangeState$.subscribe(value => {
      this.transactionService.getTransactionByRange(value.startDate, value.endDate)
                              .pipe(map(res => {
                                this.transactions = res;
                              }));
    });
  }
}

@Component({
  selector: 'app-transaction-root',
  template: '<router-outlet></router-outlet>'
})
export class TransactionRootComponent implements OnInit {
  transactions: Transaction[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { transactions: Transaction[] }) => {
        if (!data || !data.transactions) { return; }
        this.transactions = data.transactions;
      });
  }
}
