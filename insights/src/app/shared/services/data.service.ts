import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {DataSet, DayNest, Observation} from '../models';

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

        const nested = d3.nest()
          .key((row: Observation) => row.date.format('DD-MM-YYYY'))
          .key((days: Observation) => days.date.format('HH'))
          .entries(data) as Array<DayNest>;

        nested.map((d) => {
          d.total = d.values.reduce((total, hour) => total + hour.values.length, 0);
        });

        const dataSet = {
          min,
          max,
          duration: max.diff(min, 'days') + 1,
          days: nested
        };

        observer.next(dataSet);
        observer.complete();
      }, error => observer.next(error));
    });
  }
}
