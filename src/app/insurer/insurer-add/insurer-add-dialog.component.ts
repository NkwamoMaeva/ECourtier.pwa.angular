import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { InsurerService } from 'src/app/@services/insurer.service';
import { ToastService } from 'src/app/@services/toast.service';
import { ContentHeaderService } from 'src/app/@services/content-header.service';
import { LoaderService } from 'src/app/@services/loader.service';

@Component({
  selector: 'app-insurer-add-dialog',
  templateUrl: './insurer-add-dialog.component.html',
  styles: ['./insurer-add-dialog.component.scss']
})
export class AddInsurerDialogComponent implements OnInit {
  description: string;
  short_name: string;
  siege: string;
  dues = 0;
  regles = 0;
  imgURL: any;
  public imagePath;

  logoIsLoaded = false;
  file: any;
  constructor(
    private insurerService: InsurerService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<AddInsurerDialogComponent>,
    private contentHeaderService: ContentHeaderService,
    private toast: ToastService,
    private loaderService: LoaderService
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit() {
    this.contentHeaderService.contentHeader$.next({
      showTitle: true,
      title: '',
      endDateFilter: undefined,
      startDateFilter: undefined,
      hideHeader: false,
      showDateFilters: false
    });
  }
  close() {
    this.dialogRef.close();
  }
  save() {
    if (typeof this.short_name === 'undefined' || this.short_name == null) {
      this.toast.push({
        text: 'Le nom est obligatoire',
        persit: false,
        timeout: 3000
      });
      return;
    }
    // this.loaderService.loaderState$.next(true);
    const formData = new FormData();
    if(this.file === undefined || this.file == null){
      
    }
    else{
      formData.append('image', this.file, this.file.name);

    }
    formData.append('dues', this.dues.toString());
    formData.append('regles', this.regles.toString());
    formData.append('description', this.description);
    formData.append('short_name', this.short_name);
    this.insurerService.add(formData)
      .subscribe((res: any) => {
        if (res.error || res.err) {
          this.toastService.push({
            persit: false,
            timeout: 5000,
            text: res.error || res.err
          });
        } else {
          this.toastService.push({
            persit: false,
            timeout: 5000,
            text: 'Enregistrement effectué'
          });
          this.dialogRef.close('reload');
        }
        console.log(formData)
        console.log(this.file)

      });
  }

  setFile(element: { target: { files: any[]; }; }) {
    this.file = element.target.files[0];
    this.preview(this.file);
  }

  preview(files) {
    let mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.logoIsLoaded = true;
    };
    console.log(this.imagePath);

  }
}
