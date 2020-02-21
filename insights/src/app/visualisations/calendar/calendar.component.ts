import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor() { }
  hours: number[];
  days: number[];
  header = [] as {weekDay: string, dayOfMonth: string, weekend: boolean}[];
  body = [] as {value: number, weekend: boolean}[];
  keys = Object.keys;

  ngOnInit(): void {
    const now = moment();
    this.hours = Array.from({length: 24}, (v, k) => k);
    this.days = Array.from({length: 31}, (v, k) => k);

    this.days.forEach(d => {
      now.add(1, 'days');
      this.header.push({
        weekDay: now.format('dd'),
        dayOfMonth: now.format('DD'),
        weekend: this.isWeekend(now)
      });
    });
    this.body = new Array(this.hours.length).fill({});
    this.days.forEach(d => this.hours.forEach(h => {
      this.body[h][d] = {
        value: Math.floor(Math.random() * 10),
        weekend: this.header[d].weekend
      };
      console.log(d, h);
    }));
  }

  isWeekend(date: Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

}
