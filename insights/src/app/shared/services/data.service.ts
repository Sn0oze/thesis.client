import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {DataSet, Observation} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  loadCSV(): Observable<DataSet> {
    return new Observable(observer => {
      d3.text('assets/data/ptsd_filtered.csv').then(text => {
        const data = d3.csvParseRows(text).map(row => {
          return {
            timeStamp: row[0],
            date: moment(row[0]).utcOffset(row[1]),
            offset: row[1]
          } as Observation;
        });
        const min = d3.min(data.map(d => d.date));
        const max = d3.max(data.map(d => d.date));
        const nested = d3.nest()
          .key((row: Observation) => row.date.format('DD-MM-YYYY'))
          .key((g: Observation) => g.date.format('HH'))
          .entries(data);
        const dataSet = {
          min,
          max,
          duration: max.diff(min, 'days') + 1,
          data: nested
        } as DataSet;
        observer.next(dataSet);
        observer.complete();
      }, error => observer.next(error));
    });
  }
}
