import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.scss']
})
export class CancelDialogComponent implements OnInit {

  isAdding;
  constructor(@Inject(MAT_DIALOG_DATA)private data) {
    this.isAdding = data.action == 'add';
  }

  ngOnInit() {
  }

}
