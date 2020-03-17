import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import {DataSet, DayNest, Observation} from '../models';
import {moment} from '../utils';

export const dateFormat = 'DD-MM-YYYY';
export const hourFormat = 'HH';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  rowConverter(row): Observation {
    return {
      timeStamp: row[0],
      date: moment(row[0]).utcOffset(row[1]),
      offset: row[1]
    };
  }

  loadCSV(): Observable<DataSet> {
    return new Observable(observer => {
      d3.text('assets/data/ptsd_filtered.csv').then(text => {
        const data = d3.csvParseRows(text).map(this.rowConverter);
        const min = d3.min(data.map(d => d.date));
        const max = d3.max(data.map(d => d.date));
        const range = moment.range(
          min.utc().startOf('day'), max.utc().endOf('day'));
        // adding one day is a workaround because the last day is excluded for some reason
        const span = Array.from(range.by('day'), m => m.format(dateFormat));
        const months = Array.from(range.by('month'), m => m.format(dateFormat));

        const nested = d3.nest()
          .key((row: Observation) => row.date.format(dateFormat))
          .key((days: Observation) => days.date.format(hourFormat))
          .entries(data) as Array<DayNest>;

        nested.map((d) => {
          const day = moment(d.key, dateFormat);
          d.total = d.values.reduce((total, hour) => total + hour.values.length, 0);
          d.isWeekend = day.weekday() === 0 || day.weekday() === 6;
        });

        const dataSet = {
          min,
          max,
          range,
          span,
          months,
          duration: max.diff(min, 'days') + 1,
          days: nested,
        };

        observer.next(dataSet);
        observer.complete();
      }, error => observer.next(error));
    });
  }
}
