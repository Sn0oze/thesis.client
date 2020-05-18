import {DataSet} from '../models';
import {max, min} from 'd3';
import {mark, pad, parseDate, unmark} from './calendar.utils';
import {moment, timeFrameFormat} from './extended-moment';

export class CurrentSelection {
  public selection: Set<HTMLElement>;
  constructor() {
    this.selection = new Set();
    this.clear.bind(this);
    this.trim.bind(this);
    this.fillSelection.bind(this);
    this.selectedDates.bind(this);
  }

  clear(): void {
    this.selection.forEach(element => {
      unmark(element);
    });
    this.selection.clear();
  }

  trim(dataset: DataSet): void {
    if (this.selection.size) {
      this.selection.forEach(element => {
        const date = parseDate(element.dataset.date);
        const hasObservations = dataset.mappings.get(date.month)?.get(date.day)?.has(date.hour);
        if (!hasObservations) {
          this.selection.delete(element);
          unmark(element);
        }
      });
    }
  }

  fillSelection(elements: Array<HTMLElement>): void {
    const data = new Map<string, Array<number>>();
    // build map of all selected hour grouped by day
    elements.forEach(element => {
      const date = parseDate(element.dataset.date);
      const hour = parseInt(date.hour, 10);
      data.has(date.day) ? data.get(date.day).push(hour) : data.set(date.day, [hour]);
    });

    // fill in each day
    data.forEach((hours, day) => {
      const start = min(hours);
      const end = max(hours);
      for (let i = start + 1; i < end; i++) {
        // hours from 0-9 have to be zero padded
        const selector = `[data-date="${day}:${pad(i)}"]`;
        const element = document.querySelector(selector) as HTMLElement;
        this.selection.add(element);
        mark(element);
      }
    });
  }

  selectedDates(sorted= true): Array<string> {
    const dates = Array.from(this.selection).map(element => element.dataset.date);
    if (sorted) {
      dates.sort((a, b) => moment(a, timeFrameFormat).unix() - moment(b, timeFrameFormat).unix());
    }
    return dates;
  }
}
