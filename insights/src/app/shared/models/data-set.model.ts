import * as moment from 'moment';
import {Observation} from './observation.model';
import {DateRange} from 'moment-range';

export interface DataSet {
  min: moment.Moment;
  max: moment.Moment;
  duration: number;
  range: DateRange;
  span: Array<string>;
  months: Array<string>;
  days: Array<DayNest>;
}

export interface DayNest {
  key: string;
  values: Array<HourNest>;
  value?: any;
  total?: any;
  isWeekend?: boolean;
}

export interface HourNest {
  key: string;
  values: Array<Observation>;
}
