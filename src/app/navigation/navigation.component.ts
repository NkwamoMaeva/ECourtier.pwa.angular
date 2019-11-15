import { SettingsComponent } from './../settings/settings.component';
import { AuthService } from './../@services/auth.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { onMainContentChange, animateText, onSideNavChange } from '../animations';
import { ContentHeaderService } from '../@services/content-header.service';
import { ContentHeader } from '../@models/contentHeader';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { User } from '../@models/user';
import { Router } from '@angular/router';
import { TransactionService } from '../@services/transaction.service';
import { FormControl } from '@angular/forms';
import { SemesterRangeService } from '../@services/semester-range.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDialog } from '@angular/material';
import {UserService} from "../@services/user.service";

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [onMainContentChange, animateText, onSideNavChange],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NavigationComponent implements OnDestroy, OnInit {

  mobileQuery: MediaQueryList;

  fillerNav = [{
    text: 'Accueil',
    link: '/dashboard',
    icon: 'home'
  }, {
    text: 'Transactions',
    link: '/transactions',
    icon: 'description'
  }, {
    text: 'Assureurs',
    link: '/insurers',
    icon: 'business'
  }, {
    text: 'Utilisateurs',
    link: '/users',
    icon: 'account_circle'
  },
  ];
  sidenavChanged = false;

  private _mobileQueryListener: () => void;
  linkText = false;
  title = 'Insert title';
  showTitle = true;
  showDateFilters = true;
  hideHeader = true;
  user: User;
  startDateFilter = new FormControl(moment());
  endDateFilter = new FormControl(moment());


  // serializedDate = new FormControl((new Date()).toISOString());
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog,
    private contentHeaderService: ContentHeaderService,
    private authService: AuthService,
    private transactionTri: TransactionService,
    private router: Router,
    private semesterRangeService: SemesterRangeService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.user = authService.ConnectedUser;
    console.log(this.user);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.contentHeaderService.contentHeader$.subscribe((contentHeader: ContentHeader) => {
      return this.setContentHeader(contentHeader);
    });
    localStorage.setItem('filterTransac','')
  }
  chosenYearHandler(date: FormControl, normalizedYear: Moment) {
    const ctrlValue = date.value;
    ctrlValue.year(normalizedYear.year());
    date.setValue(ctrlValue);
  }

  chosenMonthHandler(date: FormControl, normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = date.value;
    ctrlValue.month(normalizedMonth.month());
    date.setValue(ctrlValue);
    this.triggerSemesterUpdate();
    datepicker.close();
  }
  toggleSidenav() {
    setTimeout(() => {
      this.linkText = this.sidenavChanged;
    }, 200);
    this.sidenavChanged = !this.sidenavChanged;
  }
  setContentHeader(contentHeader: ContentHeader) {
    contentHeader = isNullOrUndefined(contentHeader) ? new ContentHeader() : contentHeader;
    this.showTitle = !!contentHeader.showTitle;
    this.showDateFilters = !!contentHeader.showDateFilters;
    this.hideHeader = !!contentHeader.hideHeader;
    this.title = contentHeader.title || 'Insert title';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  triggerSemesterUpdate() {
    this.semesterRangeService.semesterRangeState$.next({
      endDate: this.endDateFilter.value,
      startDate: this.startDateFilter.value
    });
  }

  refreshData(){
    localStorage.setItem('filterTransac','')
  }

  openDialog(){
    this.dialog.open(SettingsComponent, {
      height: '500px',
      width:'500px'
    });
 }
}

