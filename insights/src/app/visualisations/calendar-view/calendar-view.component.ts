import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader} from '../../shared/models';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  hours: number[];
  days: number[];
  header = [] as CalendarHeader[];
  body = [] as Array<CalendarCell>[];
  totals: number[];
  constructor() { }

  ngOnInit(): void {
    const now = moment().subtract(8, 'day');
    this.hours = Array.from({length: 24}, (v, k) => k);
    this.days = Array.from({length: 31}, (v, k) => k);
    this.body = new Array(this.hours.length);
    this.totals = new Array(this.days.length).fill(0);

    this.header = this.days.map(() => {
      now.add(1, 'day');
      return {weekDay: now.format('dd'), dayOfMonth: now.format('DD'), weekend: this.isWeekend(now)};
    });

    this.hours.forEach(h => this.body[h] = this.days.map(d => {
      let value = Math.floor(Math.random() * 10);
      value = value > 5 ? value : 0;
      this.totals[d] += value;
      return {value, weekend: this.header[d].weekend, day: `${this.header[d].weekDay} ${this.header[d].dayOfMonth}`};
    }));
  }

  selected(day): void {
    alert('Selected: ' + day.day);
  }

  next(): void {}

  previous(): void {}

  isWeekend(date: moment.Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

}
