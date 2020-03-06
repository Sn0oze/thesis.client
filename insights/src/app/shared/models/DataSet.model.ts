import * as moment from 'moment';

export interface DataSet {
  min: moment.Moment;
  max: moment.Moment;
  duration: number;
  data: any;
}
