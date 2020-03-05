import * as moment from 'moment';

export interface Observation {
  timeStamp: string;
  date: moment.Moment;
  offset: string;
}
