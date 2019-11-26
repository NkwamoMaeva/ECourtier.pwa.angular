import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from '../@models/user';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {ContentHeaderService} from '../@services/content-header.service';
import {UserService} from '../@services/user.service';
import {UserDialogComponent} from './user-dialog/user-dialog.component';
import {ResponseRequest} from '../@models/responseRequest';
import {ToastService} from '../@services/toast.service';
import {AuthService} from '../@services/auth.service';
import {Observable} from "rxjs";
import {UserDialogDeleteComponent} from "./user-dialog-delete/user-dialog-delete.component";

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
  userResult: ResponseRequest<User> = new ResponseRequest<User>();
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['select', 'displayed_name', 'username', 'company', 'registration_date', 'more-actions'];
  isSearch = false;
  selection = new SelectionModel<User>(true, []);

  /**
   * Constructeur
   * @param route: ActivatedRoute
   * @param dialog: MatDialog
   * @param contentHeaderService: ContentHeaderService
   * @param router: Router
   * @param userService: UserService
   * @param toast: ToastSertvice
   * @param auth: AuthService
   */
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contentHeaderService: ContentHeaderService,
    private router: Router,
    private userService: UserService,
    private toast: ToastService,
    private auth: AuthService
  ) { }

  /**
   * Parametre l'interface en ajoutant le titre et les donnée au tableau
   */
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

    this.getData();
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
  /***
   * retourne le titre de la page
   * @return string
   */
  getTitle(): string {
    return 'Utilisateurs';
  }
  /***
   * Ajoute un utilisateur à la base de donnée
   */
  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {data: null});
    dialogRef.afterClosed().subscribe(value => {
      if (value === false) {
        this.refresh();
      }
      console.log(value);
    });
  }
  /**
   * Modifie un utilisateur passé en paramètre
   * @param row de type User
   */
  update(row: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: new User(row)
    });
  }
  /**
   * Recupère les utilisateurs dans la base de donnée les envoies au tableau
   */
  getData() {
    this.userService.getUsers().subscribe(
      value => {
        this.userResult = value;
        console.log(value);
        if (!this.userResult.success) {
          this.toast.push({
            text: this.userResult.message,
            timeout: 800,
            persit: true
          });
          return;
        }
        this.users = this.userResult.data;
        this.dataSource = new MatTableDataSource(this.users);
      },
      error1 => {
        console.log(error1);
      });
  }
  openAuthDialog(user: User) {
    const dialogRef = this.dialog.open(UserDialogDeleteComponent, {
      data: user
    });
  }
}
