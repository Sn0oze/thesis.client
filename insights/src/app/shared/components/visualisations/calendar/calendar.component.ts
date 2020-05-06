import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  CalendarSelection,
  CategorizeSelection, Category,
  DataDate,
  DataSet,
  DayNest,
  Mode,
  Observation,
  ObservationsMap,
  SelectionType
} from '../../../models';
import {scaleSequential, interpolateOrRd, min, max, ScaleSequential} from 'd3';
import {OptionsWheelService} from '../../options-wheel/options-wheel.service';
import {CELL_WIDTH} from '../../../constants';
import {WheelActionService} from '../../options-wheel/wheel-action.service';
import {Subscription} from 'rxjs';
import {
  dateFormat,
  getColor,
  getElement,
  getTextColor,
  isSelectable,
  mark,
  moment, pad,
  parseDate,
  timeFrameFormat,
  unmark
} from '../../../utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Output() annotate = new EventEmitter<CalendarSelection>();
  @Output() categorize = new EventEmitter<CategorizeSelection>();
  @Output() view = new EventEmitter<CalendarSelection>();
  @Output() filter = new EventEmitter<any>();
  @Output() selectOption = new EventEmitter<void>();
  @Input() dataSet: DataSet;
  @Input() mode: Mode;
  @ViewChild('scroll') scrollRef: ElementRef<HTMLElement>;
  @ViewChild('calendar') calendarRef: ElementRef<HTMLElement>;
  subscription: Subscription;
  scrollElement: HTMLElement;
  calendarElement: HTMLElement;
  labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
  ];
  max: number;
  readonly cellWidth = CELL_WIDTH;
  readonly min = 0;
  currentSelection = new Set<HTMLElement>();
  currentType: SelectionType;
  hammer: HammerManager;
  hourScale = scaleSequential(interpolateOrRd);
  totalScale = scaleSequential(interpolateOrRd);

  constructor(
    private zone: NgZone,
    private wheel: OptionsWheelService,
    private actions: WheelActionService
  ) {}

  ngOnInit(): void {
    const dayMax = max(this.dataSet.days, day => max(day.values, hour => hour.values.length));
    this.hourScale.domain([1, dayMax]);

    const totalMax = max(this.dataSet.days.map(day => day.total));
    this.totalScale.domain([1, totalMax]);

    this.subscription = this.actions.action.subscribe(next => {
      switch (next.action) {
        case 'trim':
          this.trim();
          break;
        case 'filter':
          this.filter.emit(this.selectedObservations());
          this.clearSelection();
          break;
        case 'annotate':
          this.annotate.emit(this.selectionResult(this.selectedDates(false)));
          this.clearSelection();
          break;
        case 'categorize':
          this.categorize.emit(
            {
              selection: this.selectionResult(this.selectedDates()),
              category: next.data as Category
            }
          );
          this.clearSelection();
          break;
        case 'view':
          this.view.emit(this.selectionResult(this.selectedWithAnnotations()));
          this.clearSelection();
          break;
      }
    });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  colorBackground(value: number, scale: ScaleSequential<string>): string {
    return getColor(value, scale);
  }
  colorText(value: number, scale: ScaleSequential<string>): string {
    return getTextColor(value, scale);
  }

  onTap(event): void {
    const element = event.target as HTMLElement;
    if (this.currentSelection.size) {
      if (!this.currentSelection.has(element)) {
        this.clearSelection();
      }
    }
  }

  // this allows to restart selection without doing any other gestures to clear an old selection
  onPanStart(): void {
    this.wheel.close();
    this.clearSelection();
  }

  onPan(event): void {
    this.panned(event);
  }

  onPress(event): void {
    const element = event.target as HTMLElement;
    if (isSelectable(element)) {
      this.zone.run(() => {
        // only show the wheel if there actually are options to chose from
        this.clearSelection();
        this.panned(event);
        this.wheel.open(event, {trim: false, filter: this.hasObservations(), view: this.hasAnnotations()});
      });
    }
  }

  onPanEnd(event): void {
    if (this.currentSelection.size) {
      if (this.currentType === 'hour') {
        this.fillSelection(Array.from(this.currentSelection));
      }
      this.zone.run(() => {
        const hasObservations = this.hasObservations();
        this.wheel.open(event, {trim: hasObservations, filter: hasObservations, view: this.hasAnnotations()});
      });
    }
  }

  addListeners(): void {
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.calendarElement);
      this.hammer.on('tap', this.onTap.bind(this));
      this.hammer.on('press', this.onPress.bind(this));
      this.hammer.on('panstart', this.onPanStart.bind(this));
      this.hammer.on('pan', this.onPan.bind(this));
      this.hammer.on('panend', this.onPanEnd.bind(this));
    });
  }
  removeListeners(): void {
    if (this.hammer) {
      this.hammer.off('tap', this.onTap);
      this.hammer.off('press', this.onTap);
      this.hammer.off('panstart', this.onPanStart);
      this.hammer.off('pan', this.onPan);
      this.hammer.off('panend', this.onPanEnd);
    }
  }

  scrollTo(position: number): void {
    if ((position >= this.min && position <= this.max)) {
      this.scrollElement.scrollLeft = position * this.cellWidth;
      this.clearSelection();
    }
  }

  panned(event): void {
    const element = getElement(event);
    if (element && isSelectable(element)) {
      const type = element.dataset.type as SelectionType;
      if (!this.currentSelection.size) {
        this.currentType = type;
      }
      if (type === this.currentType) {
        if (!this.currentSelection.has(element)) {
          this.currentSelection.add(element);
          mark(element);
        }
      }
    }
  }

  clearSelection(): void {
    this.currentSelection.forEach(element => {
     unmark(element);
    });
    this.currentSelection.clear();
    this.currentType = null;
    this.wheel.close();
  }

  trim(): void {
    if (this.currentSelection.size) {
      this.currentSelection.forEach(element => {
        const date = parseDate(element.dataset.date);
        const hasObservations = this.dataSet.mappings.get(date.month)?.get(date.day)?.has(date.hour);
        if (!hasObservations) {
          this.currentSelection.delete(element);
          unmark(element);
        }
      });
    }
  }

  selectedObservations(): ObservationsMap {
    this.trim();
    const data = new Map() as ObservationsMap;
    this.selectedDates().forEach(dateString => {
      const date = parseDate(dateString);
      const observations = this.getObservations(date);
      data.has(date.day) ?
        data.get(date.day).set(date.hour, observations) :
        data.set(date.day, new Map().set(date.hour, observations));
    });
    return data;
  }
  hasObservations(): boolean {
    return Array.from(this.currentSelection).some(element => this.getObservations(parseDate(element.dataset.date))?.length);
  }

  getObservations(date: DataDate): Array<Observation> {
    return this.dataSet.mappings.get(date.month)?.get(date.day)?.get(date.hour);
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
        this.currentSelection.add(element);
        mark(element);
      }
    });
  }

  hasAnnotationType(day: DayNest, hour: string, type: 'categories' | 'notes'): boolean {
    const date = day.date.format(dateFormat);
    const annotation = this.dataSet.annotations.get(date)?.get(hour);
    return annotation ? annotation[type]?.length > 0 : false;
  }

  categoryColor(day: DayNest, hour: string): string {
    const date = day.date.format(dateFormat);
    return this.dataSet.annotations.get(date).get(hour).categories[0].color;
  }

  selectedDates(sorted= true): Array<string> {
    const dates = Array.from(this.currentSelection).map(element => element.dataset.date);
    if (sorted) {
      dates.sort((a, b) => moment(a, timeFrameFormat).unix() - moment(b, timeFrameFormat).unix());
    }
    return dates;
  }

  selectedWithAnnotations(): Array<string> {
    const days = this.selectedDates();
    return days.filter(dateString => {
      const date = parseDate(dateString);
      return this.dataSet.annotations.get(date.day)?.has(date.hour);
    });
  }

  selectionResult(entries: Array<string>): CalendarSelection {
    return {
      type: this.currentType,
      entries
    } as CalendarSelection;
  }

  hasAnnotations(): boolean {
    return this.selectedDates().some(dateString => {
      const date = parseDate(dateString);
      return this.dataSet.annotations.get(date.day)?.has(date.hour);
    });
  }

  barHeight(fraction: number, total: number): string {
    const res = total > 0 ? Math.round(((fraction || 0) / total) * 100) : 0;
    return `${Math.ceil(res)}%`;
  }

  parseLabel(label: string): number {
    return parseInt(label, 10);
  }
}
