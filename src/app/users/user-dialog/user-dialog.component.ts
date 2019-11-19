import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../../@models/user';
import {ToastService} from '../../@services/toast.service';
import {UserService} from '../../@services/user.service';

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private toast: ToastService,
    private userService: UserService
  ) { }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.company[i] = i.toString();
    }
    console.log(this.data);
    if (this.data != null && this.data !== undefined) {
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


  setFile(element: { target: { files: any[]; }; }) {
    this.file = element.target.files[0];
    this.preview(this.file);
  }

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
    if (this.user.username === undefined || this.user.username === null || this.user.username === '') {
      this.toast.push({
        text: 'Le nom d\'utilisateur est obligatoire',
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
    const formData: FormData = new FormData();
    if (this.file !== undefined && this.file !== null) {
      formData.append('image', this.file, this.file.name);
    }
    console.log('Testststs');
    formData.append('username', this.user.username);
    formData.append('first_name', this.user.first_name);
    formData.append('last_name', this.user.last_name);
    formData.append('password', this.user.password);
    formData.append('registration_date', this.user.registration_date.toDateString());
    formData.append('username', this.user.company_id.toString());
    formData.append('image_path', this.file.name);
    formData.append('is_admin', '' + this.user.is_admin);
    formData.append('company', '' + this.user.company_id);
    this.userService.add(formData).subscribe(value => console.log(value));

    // "id": 20,
    //   "password": "jules",
    //   "username": "jules@ecourtier.app",
    //   "first_name": "Meva'a",
    //   "last_name": "Junior",
    //   "registration_date": "2019-11-13T11:05:11.846Z",
    //   "is_admin": true,
    //   "image_path": null,
    //   "company": 1
  }
  verifChange(e = null) {
    if (this.isUpdate) {
      this.change = !this.equals(this.user, this.tmp);
      console.log(this.user);
      console.log(this.tmp);
      console.log(this.change);
    }
    if (e != null) {
      this.setFile(e);
    }
  }
  public equals(user1: User, user: User): boolean {
    return user1.username === user.username &&
      user1.password === user.password &&
      user1.id === user.id &&
      user1.displayed_name === user.displayed_name &&
      user1.registration_date === user.registration_date &&
      user1.image_path === user.image_path &&
      user1.company_id === user.company_id &&
      user1.isAdmin === user.isAdmin;
  }
}
