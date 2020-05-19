import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AnnotationSummary,
  CalendarSelection,
  CategorizeSelection, Category, CategoryBar,
  DataDate,
  DataSet,
  DayNest,
  Mode,
  Observation,
  ObservationsMap,
  SelectionType
} from '../../../models';
import {scaleSequential, interpolateOrRd, max, ScaleSequential} from 'd3';
import {OptionsWheelService} from '../../options-wheel/options-wheel.service';
import {CELL_WIDTH} from '../../../constants';
import {WheelActionService} from '../../options-wheel/wheel-action.service';
import {Subscription} from 'rxjs';
import {
  CurrentSelection,
  dateFormat,
  getColor,
  getElement,
  getTextColor,
  isSelectable,
  mark,
  parseDate,
} from '../../../utils';
import {CategoryService} from '../../../services/category.service';
import {SettingsService} from '../../../services/settings.service';

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
  radialActions: Subscription;
  settings: Subscription;
  showBars: boolean;
  scrollElement: HTMLElement;
  calendarElement: HTMLElement;
  labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  max: number;
  readonly cellWidth = CELL_WIDTH;
  readonly min = 0;
  current = new CurrentSelection();
  currentType: SelectionType;
  hammer: HammerManager;
  hourScale = scaleSequential(interpolateOrRd);
  totalScale = scaleSequential(interpolateOrRd);

  constructor(
    private zone: NgZone,
    private wheel: OptionsWheelService,
    private actions: WheelActionService,
    private categories: CategoryService,
    private appSettings: SettingsService,
  ) {}

  ngOnInit(): void {
    const dayMax = max(this.dataSet.days, day => max(day.values, hour => hour.values.length));
    this.hourScale.domain([1, dayMax]);

    const totalMax = max(this.dataSet.days.map(day => day.total));
    this.totalScale.domain([1, totalMax]);

    this.settings = this.appSettings.bars.subscribe(value => this.showBars = value);

    this.radialActions = this.actions.action.subscribe(next => {
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
    this.radialActions.unsubscribe();
    this.settings.unsubscribe();
  }

  colorBackground(value: number, scale: ScaleSequential<string>): string {
    return getColor(value, scale);
  }
  colorText(value: number, scale: ScaleSequential<string>): string {
    return getTextColor(value, scale);
  }

  onTap(event): void {
    const element = event.target as HTMLElement;
    if (this.current.selection.size) {
      if (!this.current.selection.has(element)) {
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
    if (this.current.selection.size) {
      if (this.currentType === 'hour') {
        this.fillSelection(Array.from(this.current.selection));
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
      this.hammer.off('press', this.onPress);
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
      if (!this.current.selection.size) {
        this.currentType = type;
      }
      if (type === this.currentType) {
        if (!this.current.selection.has(element)) {
          this.current.selection.add(element);
          mark(element);
        }
      }
    }
  }

  clearSelection(): void {
    this.current.clear();
    this.currentType = null;
    this.wheel.close();
  }

  trim(): void {
    this.current.trim(this.dataSet);
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
    return Array.from(this.current.selection).some(element => this.getObservations(parseDate(element.dataset.date))?.length);
  }

  getObservations(date: DataDate): Array<Observation> {
    return this.dataSet.mappings.get(date.month)?.get(date.day)?.get(date.hour);
  }

  fillSelection(elements: Array<HTMLElement>): void {
    this.current.fillSelection(elements);
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
    return this.current.selectedDates(sorted);
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
    const res = Math.round(this.frac(fraction, total) * 100);
    return `${Math.ceil(res)}%`;
  }

  parseLabel(label: string): number {
    return parseInt(label, 10);
  }

  frac(fraction: number, total: number): number {
    return total > 0 ? ((fraction || 0) / total) : 0;
  }

  toList(summary: AnnotationSummary, index: number): Array<CategoryBar> {
    const total = summary.max;
    const stacked = Array.from(summary.stacked[index]).map(
      ([k, v]) => ({color: this.categories.colorByName(k), value: v})
    ).sort((a, b) => b.value - a.value) as Array<CategoryBar>;
    const sum = stacked.reduce((accumulator, current) => accumulator + current.value, 0);
    const totalHeight = this.frac(sum, total);
    let position = 0;
    stacked.forEach((item) => {
      const height = (totalHeight * this.frac(item.value, sum) * 100);
      item.position =  `${position}%`;
      item.height = `${height}%`;
      position += height;
    });
    return stacked;
  }
}
