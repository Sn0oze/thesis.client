import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ObservationGroup, ObservationsMap} from '../../../shared/models';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  days: Array<string>;
  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: ObservationsMap) { }

  ngOnInit(): void {
    this.days = Array.from(this.data.keys());
  }

  delete(day: string, hour: number, observation: number): void {
    console.log(this.data.get(day));
    this.data.get(day)[hour].observations.splice(observation, 1);
  }

  hasObservations(day: Array<ObservationGroup>): boolean {
    return day.some(group => group.observations.length);
  }
}
