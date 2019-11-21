import { InsurerUpdateDialogComponent } from './insurer-update/insurer-update-dialog.component';
import { InsurerConfirmationDialogComponent } from './insurer-confirmation-dialog/insurer-confirmation-dialog.component';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { TransactionService } from '../@services/transaction.service';
import { Transaction } from '../@models/transaction';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Insurer } from '../@models/insurer';
import { ActivatedRoute, Router } from '@angular/router';
import { AddInsurerDialogComponent } from './insurer-add/insurer-add-dialog.component';
import { ContentHeaderService } from '../@services/content-header.service';
import { ContentHeader } from '../@models/contentHeader';
import {InsurerService} from '../@services/insurer.service';

@Component({
  selector: 'app-insurer',
  templateUrl: './insurer.component.html',
  styleUrls: ['./insurer.component.scss']
})
export class InsurerComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Insurer>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['select', 'short_name', 'description', 'dues', 'regles', 'more-actions'];
  isSearch = false;
  selection = new SelectionModel<Insurer>(true, []);
  insurers: Insurer[];
  file: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contentHeaderService: ContentHeaderService,
    private router: Router , private insurerService: InsurerService
  ) {}

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { insurers: Insurer[] }) => {
        if (!data || !data.insurers) { return; }
        this.insurers = data.insurers["data"];
        this.contentHeaderService.contentHeader$.next({
          showTitle: true,
          title: 'Assureur',
          endDateFilter: undefined,
          startDateFilter: undefined,
          hideHeader: false,
          showDateFilters: false
        });
      });
    const elt = document.getElementsByClassName('cdk-overlay-pane');
    if (elt && elt.length > 0) {
      elt[0].classList.add('fullscreen');
    }

  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.insurers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.insurers)
  }
  refresh() {
    this.redirectTo([this.router.url]);
  }

  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  addInsurer() {
    const ref = this.dialog.open(AddInsurerDialogComponent);
    ref.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.refresh();
      }
    });
  }

  openDialog(id){
     this.dialog.open(InsurerConfirmationDialogComponent);
     localStorage.setItem('idDeleteInsurer',id);
  }

  openDialogUpdate(element){
    this.dialog.open(InsurerUpdateDialogComponent);
    localStorage.setItem('insurerUpdate',JSON.stringify(element));
  }

  showDetail(element) {
    localStorage.setItem('filterTransac',element)
    this.router.navigateByUrl('/transactions')
  }

}
