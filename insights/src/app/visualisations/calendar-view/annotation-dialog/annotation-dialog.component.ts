import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

class DialogOverviewExampleDialog {
}

@Component({
  selector: 'app-annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
              @Inject(MAT_DIALOG_DATA) public data: {values: Array<any>}) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
