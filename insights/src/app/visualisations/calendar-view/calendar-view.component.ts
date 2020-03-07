import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader, Mode} from '../../shared/models';
import {DataService} from '../../shared/services/data.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})

export class CalendarViewComponent implements OnInit {
  hours: number[];
  days: number[];
  header = [] as CalendarHeader[];
  body = [] as Array<CalendarCell>[];
  totals: number[];
  title: string;
  readonly dayCount = 365;
  modes = ['select', 'draw'] as Mode[];
  mode = this.modes[1];
  value: string;
  color: string;

  constructor(private data: DataService) { }

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

    this.data.loadCSV().subscribe((res) => console.log('res', res));
  }

  selected(day): void {
    console.log('Selected: ' + day);
    this.value = day;
  }

  isWeekend(date: moment.Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

  toggleMode(): void {
    this.mode = this.modes[(this.modes.indexOf(this.mode) + 1) % this.modes.length];
  }

  viewChecked(): string {
    console.log('view checked');
    return 'view checked';
  }
  changeColor(color: string): void {
    this.color = color;
  }
  isDrawMode(): boolean {
    return this.mode === 'draw';
  }
}
