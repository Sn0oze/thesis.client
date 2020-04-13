import * as moment from 'moment';

export interface Observation {
  timeStamp: string;
  date: moment.Moment;
  offset: string;
}

export interface ObservationGroup {
  hour: string;
  observations: Array<Observation>;
}
export type ObservationsMap = Map<string, Array<ObservationGroup>>;
