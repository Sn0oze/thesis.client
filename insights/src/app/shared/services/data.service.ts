import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import {Observation} from '../models/types';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  loadCSV(): Observable<any> {
    return new Observable(observer => {
      d3.text('assets/data/ptsd_filtered.csv').then(text => {
        const data = d3.csvParseRows(text).map(row => {
          return {
            timeStamp: row[0],
            date: moment(row[0]).utcOffset(row[1]),
            offset: row[1]
          } as Observation;
        });
        const nested = d3.nest()
          .key((row: Observation) => row.date.format('DD-MM-YYYY'))
          .key((g: Observation) => g.date.format('HH'))
          .entries(data);
        observer.next(nested);
        observer.complete();
      }, error => observer.next(error));
    });
  }
}
