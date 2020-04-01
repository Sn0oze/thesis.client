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
import {scaleSequential, interpolateOrRd, max, ScaleSequential} from 'd3';

const marker = 'marked';
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
  hammer: HammerManager;
  onTap: (event) => void;
  onPan: (event) => void;
  onPanEnd: () => void;
  hourScale = scaleSequential(interpolateOrRd);
  totalScale = scaleSequential(interpolateOrRd);

  constructor(private zone: NgZone) {
    this.onTap = (event) => {
      const element = event.target as HTMLElement;
      console.log(element.dataset);
      this.zone.run(() => {
        this.selected.emit([element.dataset]);
      });
    };

    this.onPan = (event) => {
      this.panned(event);
    };
    this.onPanEnd = () => {
      this.currentSelection.forEach(element => {
        element.classList.remove(marker);
      });
      this.zone.run(() => {
        this.selected.emit(Array.from(this.currentSelection).map(d => d.dataset));
      });
      this.currentSelection.clear();
    };
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
      this.hammer.on('pan', this.onPan);
      this.hammer.on('tap', this.onTap);
      this.hammer.on('panend', this.onPanEnd);
    });
  }
  removeListeners(): void {
    if (this.hammer) {
      this.hammer.off('pan', this.onPan);
      this.hammer.off('panend', this.onTap);
      this.hammer.off('tap', this.onPanEnd);
    }
  }

  scrollTo(position: number): void {
    if ((position >= this.min && position <= this.max)) {
      this.scrollElement.scrollLeft = position * this.cellWidth;
    }
  }

  mark(element: HTMLElement): void {
    const classList = element.classList;
    classList.contains('marked') ? classList.remove(marker) : classList.add(marker);
  }

  panned(event): void {
    const element = this.getElement(event);
    if (element && element.classList.contains('selectable')) {
      this.zone.runOutsideAngular(() => {
        if (!this.currentSelection.has(element)) {
          this.currentSelection.add(element);
          this.mark(element);
        }
      });
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
}
