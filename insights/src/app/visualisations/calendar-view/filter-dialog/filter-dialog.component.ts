import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ObservationsMap} from '../../../shared/models';
import {dateFormat, moment} from '../../../shared/utils';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  days: Array<string>;
  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
    '22', '23', '00'
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: ObservationsMap) { }

  ngOnInit(): void {
    this.days = Array.from(this.data.keys());
  }

  format(date: string, format: string): string {
    return moment(date, dateFormat).format(format);
  }
}
