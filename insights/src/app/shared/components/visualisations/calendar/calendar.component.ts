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
import {DataSet, Mode, Observation, ObservationsMap} from '../../../models';
import {scaleSequential, interpolateOrRd, min, max, ScaleSequential} from 'd3';
import {OptionsWheelService} from '../../options-wheel/options-wheel.service';

const marker = 'marked';
type SelectionType = 'hours' | 'month' | 'hour' | 'total' | null;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() selected = new EventEmitter<any>();
  @Output() selectOption = new EventEmitter<void>();
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
  hourScale = scaleSequential(interpolateOrRd);
  totalScale = scaleSequential(interpolateOrRd);

  constructor(
    private zone: NgZone,
    private wheel: OptionsWheelService
  ) {}

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
    if (newMode && this.scrollElement && newMode.currentValue === 'select') {
      this.addListeners();
    } else {
      this.removeListeners();
      this.clearSelection();
    }
  }

  onTap(event): void {
    const element = event.target as HTMLElement;
    if (this.currentSelection.size) {
      if (!this.currentSelection.has(element)) {
        this.clearSelection();
      }
    } else {
      if (this.isSelectable(element)) {
        this.zone.run(() => {
          this.wheel.open(event);
          // this.selected.emit([element.dataset]);
        });
      }
    }
  }

  onPanStart(): void {
    this.wheel.close();
    this.clearSelection();
  }

  onPan(event): void {
    this.panned(event);
  }

  onPanEnd(event): void {
    if (this.currentSelection.size) {
      if (this.currentType === 'hour') {
        this.fillSelection(Array.from(this.currentSelection));
      }
      this.zone.run(() => {
        // this.selected.emit(Array.from(this.currentSelection).map(d => d.dataset));
        this.wheel.open(event);
      });
    }
  }

  addListeners(): void {
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.calendarElement);
      this.hammer.on('tap', this.onTap.bind(this));
      this.hammer.on('pan', this.onPan.bind(this));
      this.hammer.on('panstart', this.onPanStart.bind(this));
      this.hammer.on('panend', this.onPanEnd.bind(this));
    });
  }
  removeListeners(): void {
    if (this.hammer) {
      this.hammer.off('tap', this.onPanEnd.bind);
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
    this.wheel.close();
  }

  parseDate(data: string): {day: string, hour: string, month: string} {
    const date = data.split(':');
    const day = date[0];
    const hour = date[1];
    const month = day.slice(3);
    return {day, hour, month};
}

  trim(): void {
    if (this.currentSelection.size) {
      this.currentSelection.forEach(element => {
        const date = this.parseDate(element.dataset.date);
        const hasObservations = this.dataSet.mappings.get(date.month)?.get(date.day)?.has(date.hour);
        if (!hasObservations) {
          this.currentSelection.delete(element);
          this.unmark(element);
        }
      });
    }
  }

  getObservations(): ObservationsMap {
    this.trim();
    const data = new Map<string, Array<{hour: string, observations: Array<Observation>}>>() as ObservationsMap;
    this.currentSelection.forEach(element => {
      const date = this.parseDate(element.dataset.date);
      const observations = this.dataSet.mappings.get(date.month)?.get(date.day)?.get(date.hour);
      data.has(date.day) ?
        data.get(date.day).push({hour: date.hour, observations}) :
        data.set(date.day, [{hour: date.hour, observations}]);
    });
    return data;
  }

  fillSelection(elements: Array<HTMLElement>): void {
    const data = new Map<string, Array<number>>();
    // build map of all selected hour grouped by day
    elements.forEach(element => {
      const date = this.parseDate(element.dataset.date);
      const hour = parseInt(date.hour, 10);
      data.has(date.day) ? data.get(date.day).push(hour) : data.set(date.day, [hour]);
    });

    // fill in each day
    data.forEach((hours, day) => {
      const start = min(hours);
      const end = max(hours);
      for (let i = start + 1; i < end; i++) {
        // hours from 0-9 have to be zero padded
        const selector = `[data-date="${day}:${i > 9 ? i : String(i).padStart(2, '0')}"]`;
        const element = document.querySelector(selector) as HTMLElement;
        this.currentSelection.add(element);
        this.mark(element);
      }
    });
  }
}
