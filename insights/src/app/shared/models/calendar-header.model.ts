import {Moment} from 'moment';

export interface CalendarHeader {
  weekDay: string;
  dayOfMonth: string;
  weekend: boolean;
  date: Moment;
}
