import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from '../@models/user';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {ContentHeaderService} from '../@services/content-header.service';
import {UserService} from '../@services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['select', 'displayed_name', 'company', 'registration_date', 'more-actions'];
  isSearch = false;
  selection = new SelectionModel<User>(true, []);
  users: User[];
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contentHeaderService: ContentHeaderService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.contentHeaderService.contentHeader$.next(
      {
        showTitle: true,
        title: this.getTitle(),
        endDateFilter: undefined,
        startDateFilter: undefined,
        hideHeader: false,
        showDateFilters: false
      }
    );
    this.route.data
      .subscribe( (data: { users: User[] }) => {
        if (!data || !data.users) {
          console.log('Not data found !');
          this.users = [
            { id: '1', password: 'tetsttvd', displayed_name: 'dcdcxc', registration_date: new Date(), image_path: null, idCompany: '1'}
          ];
          console.log(this.users);
          return;
        }
        // this.users = data.users;
        });
    const elt = document.getElementsByClassName('cdk-overlay-pane');
    if (elt && elt.length > 0) {
      elt[0].classList.add('fullscreen');
    }

  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('dfedeed');
    console.log(this.users);
  }
  refresh() {
    this.redirectTo([this.router.url]);
    console.log(this.router.url);
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
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  convertDate(date) {
    const mydate = new Date(date);
    const str = mydate.toDateString();
    return str;
  }
  getTitle() {
    return 'Utilisateur';
  }
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
