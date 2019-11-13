import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/@services/transaction.service';
import { ToastService } from '../@services/toast.service';
import { StorageService } from '../@services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private transaction: TransactionService,
    private toast: ToastService,
    private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SettingsComponent>) { }

  readyToSend: boolean;
  file: any;
  ngOnInit() {
  }
  

  close() {
    this.dialogRef.close('closing');
  }
  setFile(element: { target: { files: any[]; }; }) {
    this.file = element.target.files[0];
    this.readyToSend = true;
    console.log(this.file);
  }
  upload() {
    
    this.toast.push({
      text: 'Traitement du fichier en cours',
      persit: false,
      timeout: 3000
    });
    // this.loaderService.loaderState$.next(true);
    const formData = new FormData();
    formData.append('transactionFile', this.file, this.file.name);
        this.toast.push({
          text: 'Affichage pour traitement',
          persit: false,
          timeout: 3000
        });
        this.dialogRef.close();
      
  }

}
