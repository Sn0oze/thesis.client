import {Category} from './category.model';
import {Moment} from 'moment';
import {Annotation} from './data-set.model';

export const marker = 'marked';

export type SelectionType = 'hours' | 'month' | 'hour' | 'total' | null;

export interface DataDate {
  day: string;
  hour: string;
  month: string;
}

export interface CalendarSelection {
  type: SelectionType;
  entries: Array<string>;
}

export interface CategorizeSelection {
  selection: CalendarSelection;
  category: Category;
}

export interface DateGroup {
  date: Moment;
  dateString: string;
}

export type AnnotationDetails = Map<string, Map<string, Annotation>>;


