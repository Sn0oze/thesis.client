import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import {AnnotationMap, AnnotationSummary, DataMap, DataSet, DayNest, Observation} from '../models';
import {dateFormat, hourFormat, moment, monthFormat, timeFrameFormat} from '../utils';
import {Moment} from 'moment';
import {ANNOTATIONS_KEY} from '../constants';
import * as compression from 'lz-string';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  rowConverter(row): Observation {
    return {
      timeStamp: row[0],
      date: moment(row[0]).utcOffset(row[1]),
      offset: row[1],
      exclude: false
    };
  }

  dayNestToMap(span: Array<Moment>, nest: Array<DayNest>): DataMap {
    const dataMap = new Map() as DataMap;
    span.forEach(month => {
      dataMap.set(month.format(monthFormat), new Map());
    });

    nest.forEach(day => {
      const month = moment(day.key, dateFormat).format(monthFormat);
      const observations = new Map() as Map<string, Array<Observation>>;
      day.values.forEach(hour => observations.set(hour.key, hour.values));
      dataMap.get(month).set(day.key, observations);
    });

    return dataMap;
  }

  trimMonthRange(month: Moment, min: Moment, max: Moment): Array<Moment> {
    if (month.month() === min.month()) {
      return Array.from((moment.range(min.utc(), month.endOf('month').utc())).by('day'));
    }
    if (month.month() === max.month()) {
      return Array.from((moment.range(month.startOf('month').utc(), max.utc())).by('day'));
    }
    return Array.from((moment(month)).range('month').by('day'));
  }

  loadCSV(): Observable<DataSet> {
    return new Observable(observer => {
      d3.text('assets/data/ptsd_filtered.csv').then(text => {
        const data = d3.csvParseRows(text).map(this.rowConverter);
        const min = d3.min(data.map(d => d.date));
        const max = d3.max(data.map(d => d.date));
        const range = moment.range(
          min.clone().utc().startOf('day'), max.clone().utc().endOf('day'));
        // adding one day is a workaround because the last day is excluded for some reason
        const daySpan = Array.from(range.by('day'), m => m.format(dateFormat));

        const dayNest = d3.nest()
          .key((row: Observation) => row.date.format(dateFormat))
          .key((days: Observation) => days.date.format(hourFormat))
          .entries(data) as Array<DayNest>;

        dayNest.map((d) => {
          const day = moment(d.key, dateFormat);
          d.total = d.values.reduce((total, hour) => total + hour.values.length, 0);
          d.isWeekend = day.weekday() === 0 || day.weekday() === 6;
          d.date = day;
        });

        const monthSpan = Array.from(range.by('month'));
        const dataMap = this.dayNestToMap(monthSpan, dayNest);

        const calendarData = monthSpan.map(month => {
          const monthKey = month.format(monthFormat);
          return {
            key: monthKey,
            date: month,
            values: this.trimMonthRange(month, min, max).map(day => {
              const dayKey = day.format(dateFormat);
              return {
                key: dayKey,
                date: day,
                isWeekend: day.weekday() === 0 || day.weekday() === 6,
                total: dayNest.find(nest => nest.key === dayKey)?.total,
                values: Array.from((moment(day)).range('day').by('hour')).map(hour => {
                  const hourKey = hour.format(hourFormat);
                  const observations = dataMap.get(monthKey)?.get(dayKey)?.get(hourKey) || [];
                  return {
                    key: hour.format(hourFormat),
                    values: observations
                  };
                })
              };
            })
          };
        });

        const dataSet = {
          min,
          max,
          range,
          daySpan,
          mappings: dataMap,
          days: dayNest,
          months: calendarData,
          annotations: this.initAnnotations(),
          dailySummary: {max: 0, values: Array(7).fill(0)} as AnnotationSummary,
          hourlySummary: {max: 0, values: Array(24).fill(0)} as AnnotationSummary,
          save: this.saveAnnotations.bind(this),
          updateTotals: this.updateTotals.bind(this)
        };
        this.buildHeatmap(dataSet);
        observer.next(dataSet);
        observer.complete();
      }, error => observer.next(error));
    });
  }

  buildHeatmap(dataset: DataSet): void {
    const annotationsMap = dataset.annotations;
    const days = Array.from(annotationsMap.keys());
    days.forEach(day => {
      const date = moment(day, dateFormat);
      const dayIndex = date.day();
      const hours = Array.from(annotationsMap.get(day).keys());
      hours.forEach(hour => {
        const annotation = annotationsMap.get(day).get(hour);
        const total = annotation.categories.length + annotation.notes.length;
        dataset.dailySummary.values[dayIndex] += total;
        dataset.hourlySummary.values[parseInt(hour, 10)] += total;
      });
    });
    this.updateMax(dataset);
  }

  updateTotals(timeFrames: Array<string>, dataset: DataSet): void {
    timeFrames.forEach(dateString => {
      const date = moment(dateString, timeFrameFormat);
      dataset.dailySummary.values[date.day()] += 1;
      dataset.hourlySummary.values[date.hour()] += 1;
    });
    this.updateMax(dataset);
  }

  updateMax(dataset: DataSet): void {
    dataset.dailySummary.max = d3.max(dataset.dailySummary.values);
    dataset.hourlySummary.max = d3.max(dataset.hourlySummary.values);
  }

  saveAnnotations(dataset: DataSet): void {
    const stringified = this.mapToJson(dataset.annotations);
    this.saveToStorage(stringified);
  }

  initAnnotations(): AnnotationMap {
    const existing = this.loadFromStorage(false);
    return existing ? this.jsonToMap(existing) : new Map();
  }
  saveToStorage(stringified: string, compressed = true): void {
    const trimmed = stringified.replace(/\s/g, '');
    const value = compressed ? this.compress(trimmed) : trimmed;
    localStorage.setItem(ANNOTATIONS_KEY, value);
  }

  loadFromStorage(compressed = true): string {
    const value = localStorage.getItem(ANNOTATIONS_KEY);
    try {
      // this only succeeds if the stored value is an uncompressed json string
      JSON.parse(value);
      this.saveToStorage(value);
      return  compressed ? this.compress(value) : value;
    } catch {
      return  compressed ? value : this.decompress(value);
    }
  }

  decompress(value: string): string {
    return compression.decompressFromUTF16(value);
  }

  compress(value: string): string {
    return compression.compressToUTF16(value);
  }

  mapToJson(map: Map<any, any>) {
    const res = Array.from(map.entries()).map(([k, v]) => [k, [...v]]);
    return JSON.stringify([...res]);
  }
  jsonToMap(jsonStr): Map<any, any> {
    const nested = JSON.parse(jsonStr).map(([k, v]) => [k, new Map(v)]);
    return new Map(nested);
  }
}
