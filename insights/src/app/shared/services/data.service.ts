import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {Observable} from 'rxjs';
import {AnnotationMap, CategorySummary, Category, DataMap, DataSet, DayNest, Observation, Summary} from '../models';
import {dateFormat, hourFormat, isWeekEnd, moment, monthFormat, timeFrameFormat} from '../utils';
import {Moment} from 'moment';
import {CategoryService} from './category.service';
import {AnnotationService} from './annotation.service';

export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private categories: CategoryService,
    private annotations: AnnotationService
  ) { }

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
          d.isWeekend = isWeekEnd(day);
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
                isWeekend: isWeekEnd(day),
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
          dailySummary: {
            categories: {
              max: 0,
              values: Array(DAYS_PER_WEEK).fill(0),
              stacked: Array(DAYS_PER_WEEK).fill(null).map(() => this.initStackedCategories())
            },
            observations: {max: 0, values: Array(DAYS_PER_WEEK).fill(0)},
            notes: {max: 0, values: Array(DAYS_PER_WEEK).fill(0)}
          } as Summary,
          hourlySummary: {
            categories: {
              max: 0,
              values: Array(HOURS_PER_DAY).fill(0),
              stacked: Array(HOURS_PER_DAY).fill(null).map(() => this.initStackedCategories())
            },
            observations: {max: 0, values: Array(HOURS_PER_DAY).fill(0)},
            notes: {max: 0, values: Array(HOURS_PER_DAY).fill(0)}
          } as Summary,
          save: this.saveAnnotations.bind(this),
          updateTotals: this.updateTotals.bind(this),
          updateNoteTotals: this.updateNoteTotals.bind(this)
        };
        this.summarize(dataSet);
        observer.next(dataSet);
        observer.complete();
      }, error => observer.next(error));
    });
  }

  summarize(dataset: DataSet): void {
    const observationsMap = dataset.mappings;
    const observedMonths = Array.from(observationsMap.keys());
    const annotationsMap = dataset.annotations;
    const annotatedDays = Array.from(annotationsMap.keys());
    annotatedDays.forEach(day => {
      const date = moment(day, dateFormat);
      const dayIndex = date.day();
      const hours = Array.from(annotationsMap.get(day).keys());
      hours.forEach(hour => {
        const hourIndex = parseInt(hour, 10);
        const annotation = annotationsMap.get(day).get(hour);
        const total = annotation.categories.length; // + annotation.notes.length;
        const noteCount = annotation.notes.length; // + annotation.notes.length;
        annotation.categories.forEach(category => {
          const dayMap = dataset.dailySummary.categories.stacked[dayIndex];
          dayMap.set(category.name, dayMap.get(category.name) + 1);
          const hourMap = dataset.hourlySummary.categories.stacked[hourIndex];
          hourMap.set(category.name, hourMap.get(category.name) + 1);
        });
        dataset.dailySummary.categories.values[dayIndex] += total;
        dataset.hourlySummary.categories.values[hourIndex] += total;
        dataset.dailySummary.notes.values[dayIndex] += noteCount;
        dataset.hourlySummary.notes.values[hourIndex] += noteCount;
      });
    });
    observedMonths.forEach(month => {
      Array.from(dataset.mappings.get(month).keys()).forEach(day => {
        Array.from(dataset.mappings.get(month).get(day).keys()).forEach(hour => {
          const total = dataset.mappings.get(month).get(day).get(hour).length;
          dataset.hourlySummary.observations.values[parseInt(hour, 10)] += total;
          const date = moment(day, dateFormat);
          dataset.dailySummary.observations.values[date.day()] += total;
        });
      });
    });
    this.updateAnnotationMax(dataset);
    this.updateNoteMax(dataset);
    dataset.dailySummary.observations.max = d3.max(dataset.dailySummary.observations.values);
    dataset.hourlySummary.observations.max = d3.max(dataset.hourlySummary.observations.values);
  }

  initStackedCategories(): Map<string, number> {
    const stackedCategories = new Map();
    this.categories.getCategories().forEach(category => stackedCategories.set(category.name, 0));
    return stackedCategories;
  }

  updateTotals(timeFrames: Array<string>, dataset: DataSet, category: Category): void {
    timeFrames.forEach(dateString => {
      const date = moment(dateString, timeFrameFormat);
      this.incrementAnnotation(dataset.dailySummary.categories, date.day(), category);
      this.incrementAnnotation(dataset.hourlySummary.categories, date.hour(), category);
    });
    this.updateAnnotationMax(dataset);
  }

  updateNoteTotals(timeFrames: Array<string>, dataset: DataSet): void {
    timeFrames.forEach(dateString => {
      const date = moment(dateString, timeFrameFormat);
      dataset.dailySummary.notes.values[date.day()] += 1;
      dataset.hourlySummary.notes.values[date.hour()] += 1;
    });
    this.updateNoteMax(dataset);
  }

  incrementAnnotation(summary: CategorySummary, index: number, category: Category): void {
    summary.values[index] += 1;
    if (category) {
      const map = summary.stacked[index];
      map.set(category.name, map.get(category.name) + 1);
    }
  }

  updateNoteMax(dataset: DataSet): void {
    dataset.dailySummary.notes.max = d3.max(dataset.dailySummary.notes.values);
    dataset.hourlySummary.notes.max = d3.max(dataset.hourlySummary.notes.values);
  }

  updateAnnotationMax(dataset: DataSet): void {
    dataset.dailySummary.categories.max = d3.max(dataset.dailySummary.categories.values);
    dataset.hourlySummary.categories.max = d3.max(dataset.hourlySummary.categories.values);
  }

  saveAnnotations(dataset: DataSet): void {
    this.annotations.saveAnnotations(dataset);
  }

  initAnnotations(): AnnotationMap {
    return this.annotations.initAnnotations();
  }
}
