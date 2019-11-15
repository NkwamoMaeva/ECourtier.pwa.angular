import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
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
  @Input('users') users: User[];
  @Input('minimal') minimal: boolean;
  @Input('height') height: string;
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['select', 'displayed_name', 'company', 'registration_date', 'more-actions'];
  isSearch = false;
  selection = new SelectionModel<User>(true, []);
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

    this.userService.getUsers().subscribe(value => {
      this.users = value;
      this.dataSource = new MatTableDataSource(this.users);
      console.log('Values');
      console.log(value);
      console.log('this.users');
      console.log(this.users);
      },
      error1 => {
        console.log(error1);
      });
    // this.route.data
    //   .subscribe( (data: { users: User[] }) => {
    //     if (!data || !data.users) {
    //       console.log('Not data found !');
    //       this.users = [
    //         { id: 1, password: 'tetsttvd', displayed_name: 'Jules 0', registration_date: new Date(), image_path: null, idCompany: '1'},
    //         { id: 2, password: 'tetsttvd', displayed_name: 'Jules 1', registration_date: new Date(), image_path: null, idCompany: '1'},
    //         { id: 3, password: 'tetsttvd', displayed_name: 'Jules 2', registration_date: new Date(), image_path: null, idCompany: '1'},
    //         { id: 4, password: 'tetsttvd', displayed_name: 'Jules 3', registration_date: new Date(), image_path: null, idCompany: '1'},
    //         { id: 5, password: 'tetsttvd', displayed_name: 'Jules 4', registration_date: new Date(), image_path: null, idCompany: '1'},
    //       ];
    //       console.log(this.users);
    //       return;
    //     }
    //     // this.users = data.users;
    //     });
    const elt = document.getElementsByClassName('cdk-overlay-pane');
    if (elt && elt.length > 0) {
      elt[0].classList.add('fullscreen');
    }

  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    console.log(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    return 'Utilisateurs';
  }
  addUser() {

  }
}
