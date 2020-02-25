import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader} from '../../../models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Output() selected = new EventEmitter<any>();
  @Input() header: CalendarHeader[];
  @Input() body: Array<CalendarCell>[];
  @Input() totals: number[];
  labels: string[];

  constructor() { }

  ngOnInit(): void {
    const now = moment();
    const hours = Array.from({length: 24}, (v, k) => k);

    this.labels = hours.map((h, i) => {
      return now.hour(i).minute(60).format('HH:mm');
    });
  }

  picked(day: CalendarCell): void {
    if (day.value > 0) {
      this.selected.emit(day);
    }
  }
}
