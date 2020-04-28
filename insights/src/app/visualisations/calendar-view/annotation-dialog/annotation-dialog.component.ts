import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
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

  close(): void {
    this.dialogRef.close();
  }
  delete(index: number): void {
    this.data.values.splice(index, 1);
  }

  save(): void {
    this.dialogRef.close('test value');
  }
}
