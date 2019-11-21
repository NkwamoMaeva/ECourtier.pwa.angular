import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../@models/user';
import {ToastService} from '../../@services/toast.service';
import {UserService} from '../../@services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  title = 'Ajouter un utilisateur';
  isUpdate = false;
  user: User = new User();
  tmp: User;
  file: File;
  public imagePath;
  dues = 0;
  regles = 0;
  imgURL: any;
  logoIsLoaded = false;
  company: string[] = [];
  change = true;
  datas: any[];

  /**
   * Contructeur
   * @param data: User
   * @param toast: ToastService
   * @param router: Router
   * @param userService: UserService
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private toast: ToastService,
    private router: Router,
    private userService: UserService
  ) { }

  /**
   * Initialise
   */
  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.company[i] = i.toString();
    }
    console.log(this.data);
    if (this.data != null) {
      this.title = 'Modifier un utilisateur';
      this.user = this.data;
      this.tmp = new User(this.data);
      this.isUpdate = true;
      this.change = false;
    } else {
      this.change = true;
      console.log(this.change);
    }
  }

  /**
   * Ajoute l'image à notre variable File
   * @param element: File
   */
  setFile(element: { target: { files: any[]; }; }) {
    this.file = element.target.files[0];
    this.preview(this.file);
  }

  /**
   * ?
   * @param files: File[]
   */
  preview(files) {
    const mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files);
    reader.onload = (event) => {
      this.imgURL = reader.result;
      this.logoIsLoaded = true;
    };
    this.file = this.imagePath;
    console.log(this.file);

  }

  /**
   * Verifier s'il y'a des changement dans l'objet user
   * @param e? optionnel qui est l'évenement
   */
  verifChange(e = null) {
    if (this.isUpdate) {
      this.change = !this.equals(this.user, this.tmp);
    }
    if (e != null) {
      this.setFile(e);
    }
  }

  /**
   * Verifie si deux utilisateurs sont identiques
   * @param user1: Use
   * @param user: User
   * @return boolean
   */
  public equals(user1: User, user: User): boolean {
    return user1.username === user.username &&
      user1.password === user.password &&
      user1.id === user.id &&
      user1.first_name === user.first_name &&
      user1.last_name === user.last_name &&
      user1.registration_date === user.registration_date &&
      user1.image_path === user.image_path &&
      user1.company_id === user.company_id &&
      user1.is_admin === user.is_admin;
  }

  /***
   * Actualise la page courante
   */
  refresh() {
    this.redirectTo([this.router.url]);
    console.log(this.router.url);
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

  /**
   * Enregistre un utilisateur dans la base de donnée
   */
  save() {
    if (this.user.username === undefined || this.user.username === null || this.user.username === '') {
      this.toast.push({
        text: 'Le nom est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (this.user.password === undefined || this.user.password === null || this.user.password === '') {
      this.toast.push({
        text: 'Le mot de passe est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (this.user.first_name === undefined || this.user.first_name === null || this.user.first_name === '') {
      this.toast.push({
        text: 'Le nom est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (this.user.last_name === undefined || this.user.last_name === null || this.user.last_name === '') {
      this.toast.push({
        text: 'Le prenom est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (this.user.company_id === undefined || this.user.company_id === null) {
      this.toast.push({
        text: 'La société est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    if (this.user.registration_date === undefined || this.user.registration_date === null) {
      this.toast.push({
        text: 'Le nom date de création est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    this.userService.addUser(this.user).subscribe(response => {
      if (response.success) {
        document.getElementById('myclose-btn').click();
        this.refresh();
      } else {
        this.toast.push( {
          text: response.message,
          persit: false,
          timeout: 500
        });
      }
    });
  }

  /**
   * Modifier l'utilisateur courant (this.user).
   */
  update() {
    this.userService.update('' + this.user.id, this.user).subscribe(
      response => {
        if (response.success) {
          document.getElementById('myclose-btn').click();
          this.refresh();
        } else  {
          this.toast.push( {
            text: response.message,
            persit: false,
            timeout: 500
          });
        }
      }
    );
  }
}
