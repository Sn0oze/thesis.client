import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {moment} from '../../../shared/utils';
@Component({
  selector: 'app-annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {
  message: string;
  constructor(public dialogRef: MatDialogRef<AnnotationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {values: Array<any>}) { }

  ngOnInit(): void {
  }

  save(): void {
    const now = moment();
    let message = this.message;
    if (!message) {
      message = `
      Real note from ${now.format('dddd, MMMM Do YYYY')}.
      This comment was made at ${now.format('HH:mm')}
    `;
    }
    this.dialogRef.close(message);
  }
}
