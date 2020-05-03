import * as moment from 'moment';

export interface Observation {
  timeStamp: string;
  date: moment.Moment;
  offset: string;
  exclude: boolean;
}

export interface ObservationGroup {
  hour: string;
  observations: Array<Observation>;
}
export type ObservationsMap = Map<string, Map<string, Array<Observation>>>;
