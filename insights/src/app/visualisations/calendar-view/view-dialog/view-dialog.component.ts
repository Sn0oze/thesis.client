import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AnnotationDetails} from '../../../shared/models';
import {dateFormat, hourMinuteFormat, moment, readableFontColor} from '../../../shared/utils';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class ViewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public days: AnnotationDetails) { }

  ngOnInit(): void {
  }

  readable(hex: string): string {
    return readableFontColor(hex);
  }

  formatHour(hour: string): string {
    const now = moment();
    now.set('hour', parseInt(hour, 10));
    now.set('minutes', 0);
    const end = now.clone().add(1, 'hour');
    return `${now.format(hourMinuteFormat)} - ${end.format(hourMinuteFormat)}`;
  }

  format(date: string, format: string): string {
    return moment(date, dateFormat).format(format);
  }
}
