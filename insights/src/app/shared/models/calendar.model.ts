import {Category} from './category.model';

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

