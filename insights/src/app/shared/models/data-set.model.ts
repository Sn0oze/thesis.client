import * as moment from 'moment';
import {Observation} from './observation.model';

export interface DataSet {
  min: moment.Moment;
  max: moment.Moment;
  duration: number;
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
