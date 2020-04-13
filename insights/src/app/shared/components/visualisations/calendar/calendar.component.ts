import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import {DataSet, Mode} from '../../../models';
import {scaleSequential, interpolateOrRd, min, max, ScaleSequential} from 'd3';
import {dateFormat} from '../../../utils';

const marker = 'marked';
type SelectionType = 'hours' | 'month' | 'hour' | 'total' | null;
type Shape = 'hLine' | 'vLine' | 'line' | 'complex';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() selected = new EventEmitter<any>();
  @Input() dataSet: DataSet;
  @Input() mode: Mode;
  @ViewChild('scroll') scrollRef: ElementRef<HTMLElement>;
  @ViewChild('calendar') calendarRef: ElementRef<HTMLElement>;
  scrollElement: HTMLElement;
  calendarElement: HTMLElement;
  labels: string[];
  max: number;
  readonly cellWidth = 32;
  readonly min = 0;
  currentSelection = new Set<HTMLElement>();
  currentType: SelectionType;
  hammer: HammerManager;
  onTap: (event) => void;
  onPanStart: () => void;
  onPan: (event) => void;
  onPanEnd: () => void;
  hourScale = scaleSequential(interpolateOrRd);
  totalScale = scaleSequential(interpolateOrRd);

  constructor(private zone: NgZone) {
    this.onTap = (event) => {
      const element = event.target as HTMLElement;
      if (this.currentSelection.size) {
        if (!this.currentSelection.has(element)) {
          this.clearSelection();
        }
      } else {
        if (this.isSelectable(element)) {
          this.zone.run(() => {
            // this.selected.emit([element.dataset]);
          });
        }
      }
    };

    this.onPanStart = () => {
      this.clearSelection();
    };

    this.onPan = (event) => {
      this.panned(event);
    };

    this.onPanEnd = () => {
      if (this.currentSelection.size) {
        if (this.currentType === 'hour') {
          const elements = Array.from(this.currentSelection);
          const shape = this.categorize(elements.map(element => element.getBoundingClientRect()));
          if (shape === 'complex') {
            this.fillSelection(elements);
          }
        }
        this.zone.run(() => {
          // this.selected.emit(Array.from(this.currentSelection).map(d => d.dataset));
        });
      }
    };
  }
  fillSelection(elements: Array<HTMLElement>): void {
    const data = new Map<string, Array<number>>();
    // build map of all selected hour grouped by day
    elements.forEach(element => {
      const date = element.dataset.date.split(':');
      const day = date[0];
      const hour = parseInt(date[1], 10);
      data.has(day) ? data.get(day).push(hour) : data.set(day, [hour]);
    });

    // fill in each day
    data.forEach((hours, day) => {
      const start = min(hours);
      const end = max(hours);
      if (start === end) {
        // const previous = moment(day, dateFormat).subtract(1, 'day').format(dateFormat);
        // const next = moment(day, dateFormat).add(1, 'day').format(dateFormat);
        // console.log(day, previous, next);
      }
      for (let i = start + 1; i < end; i++) {
        // hours from 0-9 have to be zero padded
        const selector = `[data-date="${day}:${i > 9 ? i : String(i).padStart(2, '0')}"]`;
        const element = document.querySelector(selector) as HTMLElement;
        this.currentSelection.add(element);
        this.mark(element);
      }
    });
  }

  categorize(elements: Array<DOMRect>): Shape {
    const first = elements[0];
    const last = elements[elements.length - 1];
    const height = first.height;
    const width = first.width;
    if (this.inRadius(first.x, last.x, 4 * height) && this.inRadius(first.y, last.y, 4 * width)) {
      return 'complex';
    }
    return 'line';
  }

  inRadius(a: number, b: number, threshold: number): boolean {
    return Math.abs(b - a) <= threshold;
  }

  ngOnInit(): void {
    const now = moment();
    const hours = Array.from({length: 24}, (v, k) => k);

    this.labels = hours.map((h, i) => {
      return now.hour(i).minute(60).format('HH:mm');
    });
    this.labels.unshift('00:00');
    const dayMax = max(this.dataSet.days, day => max(day.values, hour => hour.values.length));
    this.hourScale.domain([1, dayMax]);

    const totalMax = max(this.dataSet.days.map(day => day.total));
    this.totalScale.domain([1, totalMax]);
  }

  ngAfterViewInit(): void {
    this.scrollElement = this.scrollRef.nativeElement as HTMLElement;
    this.calendarElement = this.calendarRef.nativeElement as HTMLElement;
    this.max = this.scrollElement.scrollWidth;
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.calendarElement);
    });
    if (this.mode === 'select') {
      this.addListeners();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    const newMode = changes.mode;
    if (newMode && this.scrollElement) {
      const value = newMode.currentValue;
      value === 'select' ? this.addListeners() : this.removeListeners();
    }
  }

  addListeners(): void {
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.calendarElement);
      this.hammer.on('tap', this.onTap);
      this.hammer.on('pan', this.onPan);
      this.hammer.on('panstart', this.onPanStart);
      this.hammer.on('panend', this.onPanEnd);
    });
  }
  removeListeners(): void {
    if (this.hammer) {
      this.hammer.off('tap', this.onPanEnd);
      this.hammer.off('panstart', this.onPanStart);
      this.hammer.off('pan', this.onPan);
      this.hammer.off('panend', this.onTap);
    }
  }

  scrollTo(position: number): void {
    if ((position >= this.min && position <= this.max)) {
      this.scrollElement.scrollLeft = position * this.cellWidth;
    }
  }

  mark(element: HTMLElement): void {
    element.classList.add(marker);
  }
  unmark(element: HTMLElement): void {
    element.classList.remove(marker);
  }

  panned(event): void {
    const element = this.getElement(event);
    if (element && this.isSelectable(element)) {
      const type = element.dataset.type as SelectionType;
      if (!this.currentSelection.size) {
        this.currentType = type;
      }
      if (type === this.currentType) {
        this.zone.runOutsideAngular(() => {
          if (!this.currentSelection.has(element)) {
            this.currentSelection.add(element);
            this.mark(element);
          }
        });
      }
    }
  }
  getColor(value: number, scale: ScaleSequential<string>): string {
    return value > 0 ? scale(value) : '';
  }
  getTextColor(value: number, scale: ScaleSequential<string>): string {
    return value >= scale.domain()[1] * .66 ? 'rgba(255,255,255,.87)' : 'rgba(0,0,0,.87)';
  }

  getElement(event): HTMLElement {
    return document.elementFromPoint(event.center.x, event.center.y) as HTMLElement;
  }

  isSelectable(element: HTMLElement | DOMTokenList): boolean {
    return element instanceof HTMLElement ? element.classList.contains('selectable') : element.contains('selectable');
  }

  clearSelection(): void {
    this.currentSelection.forEach(element => {
     this.unmark(element);
    });
    this.currentSelection.clear();
    this.currentType = null;
  }

  trim(): void {
    if (this.currentSelection.size) {
      this.currentSelection.forEach(element => {
        const date = element.dataset.date.split(':');
        const day = date[0];
        const hour = date[1];
        const month = day.slice(3);
        const hasObservations = this.dataSet.mappings.get(month)?.get(day)?.has(hour);
        if (!hasObservations) {
          this.unmark(element);
        }
      });
    }
  }
}
