import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {moment} from '../../../shared/utils';
@Component({
  selector: 'app-annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AnnotationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {values: Array<any>}) { }

  ngOnInit(): void {
  }

  save(): void {
    this.dialogRef.close('Real note from ' + moment().format('dddd, MMMM Do YYYY'));
  }
}
