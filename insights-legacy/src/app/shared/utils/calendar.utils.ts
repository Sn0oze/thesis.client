import {CalendarDetails, DataDate, marker} from '../models';
import {ScaleSequential, min, max} from 'd3';
import {timeFrameSeparator} from './extended-moment';
import {Moment} from 'moment';

export function mark(element: HTMLElement): void {
  element.classList.add(marker);
}
export function unmark(element: HTMLElement): void {
  element.classList.remove(marker);
}

export function getColor(value: number, scale: ScaleSequential<string>): string {
  return value > 0 ? scale(value) : '';
}
export function getTextColor(value: number, scale: ScaleSequential<string>): string {
  return value >= scale.domain()[1] * .66 ? 'rgba(255,255,255,.87)' : 'rgba(0,0,0,.87)';
}

export function getElement(event): HTMLElement {
  return document.elementFromPoint(event.center.x, event.center.y) as HTMLElement;
}

export function isSelectable(element: HTMLElement | DOMTokenList): boolean {
  return element instanceof HTMLElement ? element.classList.contains('selectable') : element.contains('selectable');
}

export function parseDate(data: string): DataDate {
  const timeFrame = data.split(timeFrameSeparator);
  // TODO refactor day to date
  const day = timeFrame[0];
  const hour = timeFrame[1];
  const month = day.slice(3);
  return {day, hour, month};
}

export function pad(value: number): string {
  return value > 9 ? value.toString() : String(value).padStart(2, '0');
}

export function hoursFromDetails(map: CalendarDetails): Array<string> {
  const days = Array.from(map.keys()) as Array<string>;
  const unique = days.reduce((hours, day) => {
    Array.from(map.get(day).keys()).map(hour => {
      hours.add(parseInt(hour, 10));
    });
    return hours;
  }, new Set()) as Set<number>;
  const result = Array.from(unique);
  const start = min(result);
  const end = max(result);
  return Array(end - start + 1).fill(0).map((_, index) => pad(start + index));
}

export function  isWeekEnd(day: Moment): boolean {
  return day.weekday() === 0 || day.weekday() === 6;
}


