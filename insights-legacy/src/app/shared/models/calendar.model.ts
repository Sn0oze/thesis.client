import {Category} from './category.model';
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

export type AnnotationDetails = Map<string, Map<string, Annotation>>;

export type CalendarDetails = Map<string, Map<string, any>>;

export interface CategoryBar {
  color: string;
  value: number;
  position?: string;
  height?: string;
}

export interface Shape {
  line: Array<{x: number, y: number}>;
  stroke: string;
  color: string;
}

export interface CanvasEvent {
  shape: Shape;
  action: 'added' | 'removed';
}



