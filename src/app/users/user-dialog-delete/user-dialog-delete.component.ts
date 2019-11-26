import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../@models/user';
import {UserService} from '../../@services/user.service';
import {AuthService} from '../../@services/auth.service';
import {ToastService} from "../../@services/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-dialog-delete',
  templateUrl: './user-dialog-delete.component.html',
  styleUrls: ['./user-dialog-delete.component.scss']
})
export class UserDialogDeleteComponent implements OnInit {
  username: string;
  password: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = this.auth.ConnectedUser.username;
  }

  /***
   * Actualise la page courante
   */
  refresh() {
    this.redirectTo([this.router.url]);
  }

  /**
   * redirige vers l'url mis en paramètre
   * @param uri:?
   */
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }
  delete() {
    this.userService.deleteUser(this.data.id, this.username, this.password).subscribe(
      value => {
        this.toast.push({
          text: value.message,
          persit: false,
          timeout: 3000
        });
        if (value.success) {
          document.getElementById('myclose-btn').click();
          this.refresh();
        }
      }
    );
  }

}
