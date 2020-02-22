import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Output() selected = new EventEmitter<any>();
  hours: number[];
  days: number[];
  header = [] as {weekDay: string, dayOfMonth: string, weekend: boolean}[];
  body = [] as Array<{value: number, weekend: boolean, day: string}>[];
  labels: string[];
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

    this.labels = this.hours.map((h, i) => {
      return now.hour(i).minute(60).format('HH:mm');
    });

    this.hours.forEach(h => this.body[h] = this.days.map(d => {
      let value = Math.floor(Math.random() * 10);
      value = value > 5 ? value : 0;
      this.totals[d] += value;
      return {value, weekend: this.header[d].weekend, day: `${this.header[d].weekDay} ${this.header[d].dayOfMonth}`};
    }));
  }

  isWeekend(date: Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

  picked(day): void {
    this.selected.emit(day);
  }
}
