import * as moment from 'moment';
import {Observation} from './observation.model';
import {DateRange} from 'moment-range';
import {Moment} from 'moment';
import {Category} from './category.model';

export interface DataSet {
  min: moment.Moment;
  max: moment.Moment;
  range: DateRange;
  daySpan: Array<string>;
  mappings: DataMap;
  days: Array<DayNest>;
  months: Array<MonthNest>;
  annotations?: AnnotationMap;
  dailySummary: AnnotationSummary;
  hourlySummary: AnnotationSummary;
  save: (dataset: DataSet) => void;
  updateTotals: (timeFrames: Array<string>, dataset: DataSet) => void;
}

export interface DayNest {
  key: string;
  values: Array<Nest>;
  date: Moment;
  value?: any;
  total?: any;
  isWeekend?: boolean;
}

export interface Nest {
  key: string;
  values: Array<Observation>;
}

export interface MonthNest {
  key: string;
  date: Moment;
  values: Array<DayNest>;
}

export interface Annotation {
  categories: Array<Category>;
  notes: Array<Note>;
}

export interface Note {
  crated: string;
  body: string;
}

export interface AnnotationSummary {
  max: number;
  values: Array<number>;
}

export type DataMap = Map<string, Map<string, Map<string, Array<Observation>>>>;

export type AnnotationMap = Map<string, Map<string, Annotation>>;

