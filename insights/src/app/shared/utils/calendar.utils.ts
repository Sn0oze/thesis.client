import {DataDate, marker} from '../models';
import {ScaleSequential} from 'd3';

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
  const date = data.split(':');
  const day = date[0];
  const hour = date[1];
  const month = day.slice(3);
  return {day, hour, month};
}
