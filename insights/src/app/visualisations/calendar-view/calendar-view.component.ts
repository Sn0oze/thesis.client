import {Component, OnInit} from '@angular/core';
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
  title: string;
  lastTap: number;
  readonly dayCount = 365;
  modes = ['navigate', 'draw'];
  mode = this.modes[0];

  constructor() { }

  ngOnInit(): void {
    const now = moment().subtract(this.dayCount, 'day');
    this.hours = Array.from({length: 24}, (v, k) => k);
    this.days = Array.from({length: this.dayCount}, (v, k) => k);
    this.body = new Array(this.hours.length);
    this.totals = new Array(this.days.length).fill(0);

    this.header = this.days.map(() => {
      now.add(1, 'day');
      return {
        weekDay: now.format('dd'),
        dayOfMonth: now.format('DD'),
        weekend: this.isWeekend(now),
        date: now.clone()
      };
    });

    this.hours.forEach(h => this.body[h] = this.days.map(d => {
      let value = Math.floor(Math.random() * 10);
      value = value > 5 ? value : 0;
      this.totals[d] += value;
      return {value, weekend: this.header[d].weekend, day: `${this.header[d].weekDay} ${this.header[d].dayOfMonth}`};
    }));
    const rangeStart = this.header[0].date;
    const rangeEnd = this.header[this.header.length - 1].date;
    const format = 'MMMM Do';
    this.title = `${rangeStart.format(format)} - ${rangeEnd.format(format)}`;
  }

  selected(day): void {
   console.log('Selected: ' + day.day);
  }

  isWeekend(date: moment.Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

  changeMode(event): void {
    const threshold = 500;
    const currentTime = event.timeStamp;
    // only values below the threshold are considered double taps
    if (this.lastTap && currentTime - this.lastTap <= threshold) {
      this.mode = this.modes[(this.modes.indexOf(this.mode) + 1) % this.modes.length];
      event.stopImmediatePropagation();

    }
    this.lastTap = currentTime;
  }
}
