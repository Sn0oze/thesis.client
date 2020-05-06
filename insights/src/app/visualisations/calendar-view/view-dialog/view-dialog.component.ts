import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AnnotationDetails} from '../../../shared/models';
import {dateFormat, hoursFromDetails, moment} from '../../../shared/utils';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class ViewDialogComponent implements OnInit {
  days: Array<string>;
  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
    '22', '23', '00'
  ];
  delete: boolean;
  toDelete = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: AnnotationDetails) { }

  ngOnInit(): void {
    this.days = Array.from(this.data.keys());
    this.hours = hoursFromDetails(this.data);

  }

  format(date: string, format: string): string {
    return moment(date, dateFormat).format(format);
  }
  drop(event: CdkDragDrop<string[]>, list: Array<any>) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  dragStart(event): void {
    this.delete = true;
  }

  dragEnd(event): void {
    this.delete = false;
  }
  deleteItem(event): void {
    console.log('delete');
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  noReturnPredicate(): boolean {
    return false;
  }
}
