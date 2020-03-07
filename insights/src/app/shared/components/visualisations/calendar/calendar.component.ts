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
import {CalendarCell, CalendarHeader, Mode} from '../../../models';

const marker = 'marked';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() selected = new EventEmitter<any>();
  @Output() modeChange = new EventEmitter<Mode>();
  @Input() header: CalendarHeader[];
  @Input() body: Array<CalendarCell>[];
  @Input() totals: number[];
  @Input() mode: Mode;
  @ViewChild('scroll') scrollRef: ElementRef<HTMLElement>;
  scrollElement: HTMLElement;
  labels: string[];
  max: number;
  readonly cellWidth = 37;
  readonly min = 0;
  currentSelection = new Set<HTMLElement>();
  hammer: HammerManager;
  onTap: (event) => void;
  onPan: (event) => void;
  onPanEnd: () => void;

  constructor(private zone: NgZone) {
    this.onTap = (event) => {
      const element = (event.target as HTMLElement);
      this.zone.run(() => {
        this.selected.emit(element.innerText);
        this.mark(element);
      });
    };

    this.onPan = (event) => {
      const element = (event.target as HTMLElement);
      if (element.innerText) {
        this.panned(event);
        this.currentSelection.add(element);
      }
    };
    this.onPanEnd = () => {
      this.currentSelection.forEach(element => {
        element.classList.remove(marker);
      });
      this.zone.run(() => {
        this.selected.emit(this.currentSelection.values());
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
  }

  ngAfterViewInit(): void {
    this.scrollElement = this.scrollRef.nativeElement as HTMLElement;
    this.max = this.scrollElement.scrollWidth;
    this.zone.runOutsideAngular(() => {
      this.hammer = new Hammer(this.scrollElement);
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
      this.hammer = new Hammer(this.scrollElement);
      this.hammer.on('panmove', this.onPan);
      this.hammer.on('tap', this.onTap);
      this.hammer.on('panend', this.onPanEnd);
    });
  }
  removeListeners(): void {
    if (this.hammer) {
      this.hammer.off('panmove', this.onPan);
      this.hammer.off('panend', this.onTap);
      this.hammer.off('tap', this.onPanEnd);
    }
  }

  next(): void {
    this.zone.runOutsideAngular(() => {
      if (this.scrollElement.scrollLeft + this.cellWidth <= this.max) {
        this.scrollElement.scrollLeft += this.cellWidth;
      }
    });
  }

  previous(): void {
    if (this.scrollElement.scrollLeft - this.cellWidth >= this.min) {
      this.scrollElement.scrollLeft -= this.cellWidth;
    }
  }

  scrollTo(position: number): void {
    if ((position >= this.min && position <= this.max)) {
      this.scrollElement.scrollLeft = position;
    }
  }
  scrollStart(): void {
    this.scrollElement.scrollLeft = 0;
  }

  scrollEnd(): void {
    this.scrollElement.scrollLeft = this.max;
  }

  mark(element: HTMLElement): void {
    const classList = element.classList;
    if (element.innerText) {
      classList.contains('marked') ? classList.remove(marker) : classList.add(marker);
    }
  }

  panned(event): void {
    const element = event.target;
    this.zone.runOutsideAngular(() => {
      if (!this.currentSelection.has(element)) {
        this.currentSelection.add(element);
        this.mark(element);
      }
    });
  }
}
