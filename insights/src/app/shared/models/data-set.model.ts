import * as moment from 'moment';
import {Observation} from './observation.model';
import {DateRange} from 'moment-range';
import {Moment} from 'moment';

export interface DataSet {
  min: moment.Moment;
  max: moment.Moment;
  range: DateRange;
  daySpan: Array<string>;
  days: Array<DayNest>;
  months: Array<MonthNest>;
}

export interface DayNest {
  key: string;
  values: Array<Nest>;
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
