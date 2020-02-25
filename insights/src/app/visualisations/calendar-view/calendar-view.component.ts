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
  headerRange = [] as CalendarHeader[];
  bodyRange = [] as Array<CalendarCell>[];
  totalsRange: number[];
  title: string;
  current = 24;
  readonly range = window.innerWidth >= 1000 ? 31 : 8;
  readonly dayCount = 100;
  readonly min = 0;
  readonly max = this.dayCount - this.range;
  text: string;
  includeAll = false;

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
        date: now.clone()};
    });

    this.hours.forEach(h => this.body[h] = this.days.map(d => {
      let value = Math.floor(Math.random() * 10);
      value = value > 5 ? value : 0;
      this.totals[d] += value;
      return {value, weekend: this.header[d].weekend, day: `${this.header[d].weekDay} ${this.header[d].dayOfMonth}`};
    }));
    this.selectSubset();
  }

  selectSubset(): void {
    const end = this.current + this.range;
    this.headerRange = this.header.slice(this.current, end);
    this.bodyRange = this.body.map(r => r.slice(this.current, end));
    this.totalsRange = this.totals.slice(this.current, end);
    const rangeStart = this.headerRange[0].date;
    const rangeEnd = this.headerRange[this.headerRange.length - 1].date;
    const format = 'MMMM Do';
    this.title = `${rangeStart.format(format)} - ${rangeEnd.format(format)}`;
  }

  selected(day): void {
    alert('Selected: ' + day.day);
  }

  next(): void {
    if (this.current < this.max) {
      this.current += 1;
      this.selectSubset();
    }
  }

  previous(): void {
    if (this.current > this.min) {
      this.current -= 1;
      this.selectSubset();
    }
  }

  isWeekend(date: moment.Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

  pan(event): void {
    if (!this.includeAll) {
      this.text = event.additionalEvent + ': ' + event.distance.toFixed(0);
      event.additionalEvent === 'panleft' ? this.previous() : this.next();
    }
  }
}
