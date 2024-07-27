import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CategorySummary,
  CalendarSelection,
  CategoryBar,
  DataDate,
  DataSet, DayNest,
  Observation,
  SelectionType, BaseSummary
} from '../../../models';
import {
  CurrentSelection,
  dateFormat,
  getElement,
  isSelectable,
  isWeekEnd,
  mark,
  moment,
  parseDate
} from '../../../utils';
import {OptionsWheelService} from '../../options-wheel/options-wheel.service';
import {WheelActionService} from '../../options-wheel/wheel-action.service';
import {CategoryService} from '../../../services/category.service';
import {Moment} from 'moment';


@Component({
  selector: 'app-summary-calendar',
  templateUrl: './summary-calendar.component.html',
  styleUrls: ['./summary-calendar.component.scss']
})
export class SummaryCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('summaryCalendar') calendarRef: ElementRef<HTMLElement>;
  @Output() view = new EventEmitter<CalendarSelection>();
  @Input() dataSet: DataSet;
  calendarElement: HTMLElement;
  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
  ];
  max: number;
  current = new CurrentSelection();
  currentType: SelectionType;
  hammer: HammerManager;
  week: Array<{ date: Moment, isWeekend: boolean }>;

  constructor(
    private zone: NgZone,
    private wheel: OptionsWheelService,
    private actions: WheelActionService,
    private categories: CategoryService
  ) {}

  ngOnInit(): void {
    this.week = Array.from(moment.range(moment().startOf('isoWeek'), moment().endOf('isoWeek')).by('day')).map(
      day => ({date: day, isWeekend: isWeekEnd(day)})
    );
  }

  ngAfterViewInit(): void {
    /*
    this.calendarElement = this.calendarRef.nativeElement as HTMLElement;
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.calendarElement);
    });
    // this.addListeners();
    */
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
      this.hammer.on('panstart', this.onPanStart.bind(this));
      this.hammer.on('pan', this.onPan.bind(this));
      this.hammer.on('panend', this.onPanEnd.bind(this));
    });
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

  hasCategories(day: number, hour: string): boolean {
    return this.dataSet.hourlySummary.categories.values[this.parseLabel(hour)] > 0 &&
      this.dataSet.dailySummary.categories.values[day] > 0;
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

  toList(summary: CategorySummary, index: number): Array<CategoryBar> {
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

  bubbleSize(data: BaseSummary, key: number): string {
    const max = data.max > 0 ? data.max : 1;
    const size = data.values[key] / max;
    return `${size}rem`;
  }
}
