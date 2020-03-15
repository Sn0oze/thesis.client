import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader, DataSet, Mode} from '../../shared/models';
import {DataService} from '../../shared/services/data.service';
import {COLORS, PEN_WIDTHS} from '../../shared/constants';
import {DrawCanvasComponent} from '../../shared/components/visualisations/draw-canvas/draw-canvas.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})

export class CalendarViewComponent implements OnInit {
  @ViewChild('canvas') canvas: DrawCanvasComponent;
  hours: number[];
  days: number[];
  header = [] as CalendarHeader[];
  body = [] as Array<CalendarCell>[];
  totals: number[];
  title: string;
  readonly dayCount = 365;
  modes = ['select', 'draw'] as Mode[];
  mode = this.modes[1] as Mode;
  value: string;
  color: string;
  width: string;
  dataSet: DataSet;

  constructor(private route: ActivatedRoute) { }

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
    this.width = PEN_WIDTHS[0];
    this.color = COLORS[0];
    this.dataSet = this.route.parent.snapshot.data.dataSet;
    console.log(this.dataSet);
  }

  selected(day): void {
    console.log('Selected: ' + day);
    this.value = day;
  }

  isWeekend(date: moment.Moment): boolean {
    const day = date.day();
    return day === 6 || day === 0;
  }

  viewChecked(): string {
    console.log('view checked');
    return 'view checked';
  }

  isDrawMode(): boolean {
    return this.mode === 'draw';
  }

  undo(): void {
    if (this.canvas) {
      this.canvas.undo();
    }
  }
}
