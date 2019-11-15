import { Component, OnInit } from '@angular/core';
import { InsurerService } from 'src/app/@services/insurer.service';
import { ToastService } from 'src/app/@services/toast.service';
import { MatDialogRef } from '@angular/material';
import { ContentHeaderService } from 'src/app/@services/content-header.service';
import { LoaderService } from 'src/app/@services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insurer-update-dialog',
  templateUrl: './insurer-update-dialog.component.html',
  styleUrls: ['./insurer-update-dialog.component.scss']
})
export class InsurerUpdateDialogComponent implements OnInit {
  element;
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
    public dialogRef: MatDialogRef<InsurerUpdateDialogComponent>,
    private contentHeaderService: ContentHeaderService,
    private toast: ToastService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.contentHeaderService.contentHeader$.next({
      showTitle: true,
      title: '',
      endDateFilter: undefined,
      startDateFilter: undefined,
      hideHeader: false,
      showDateFilters: false
    });
    this.element = JSON.parse(localStorage.getItem('insurerUpdate'));
    this.short_name = this.element['short_name'];
    this.description = this.element['description'];
  }

 
  close() {
    this.dialogRef.close();
  }

  refresh() {
    this.redirectTo([this.router.url]);
  }
  redirectTo(uri) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(uri)
    );
  }

  updateInsureur() {
      this.insurerService.update(this.element['id'],this.element).subscribe(res => {
        this.refresh();
      });
  }
}