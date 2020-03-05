import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader, Mode} from '../../../models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Output() selected = new EventEmitter<any>();
  @Output() modeChange = new EventEmitter<Mode>();
  @Input() header: CalendarHeader[];
  @Input() body: Array<CalendarCell>[];
  @Input() totals: number[];
  @Input() mode: Mode;
  @ViewChild('scroll') scrollRef: ElementRef<HTMLElement>;
  scrollElement: Element;
  labels: string[];
  max: number;
  readonly cellWidth = 37;
  readonly min = 0;
  modes = ['select', 'draw'] as Mode[];
  shapes = new Set<HTMLElement>();

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    const now = moment();
    const hours = Array.from({length: 24}, (v, k) => k);

    this.labels = hours.map((h, i) => {
      return now.hour(i).minute(60).format('HH:mm');
    });
  }

  ngAfterViewInit(): void {
    this.scrollElement = this.scrollRef.nativeElement;
    this.max = this.scrollElement.scrollWidth;

    this.zone.runOutsideAngular(() => {
      this.scrollElement.addEventListener('click', (event) => {
        const element = (event.target as HTMLElement);
        if (element.nodeName === 'TD' && element.innerText) {
          this.zone.run(() => {
            this.selected.emit(element.innerText);
          });
        }
      });
      this.scrollElement.addEventListener('touchstart', (event) => {
        const element = (event.target as HTMLElement);
        if (element.nodeName === 'TD' && element.innerText) {
          this.zone.run(() => {
            this.selected.emit(element.innerText);
            this.mark(element);
          });
        }
      });
      this.scrollElement.addEventListener('touchmove', (event) => {
        const element = (event.target as HTMLElement);
        if (element.nodeName === 'TD' && element.innerText) {
          this.zone.run(() => {
            // this.panned(event);
          });
        }
      });
      this.scrollElement.addEventListener('mousemove', (event) => {
        const element = (event.target as HTMLElement);
        if (element.nodeName === 'TD' && element.innerText) {
          this.panned(event);
        }
      });
    });
  }

  next(): void {
    this.zone.runOutsideAngular(() => {
      if (this.scrollElement.scrollLeft + this.cellWidth <= this.max) {
        this.scrollElement.scrollLeft += this.cellWidth;
      }
    });
  }

  previous(): void {
    console.log(this.scrollElement.scrollLeft, this.cellWidth, this.scrollElement.scrollWidth);
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

  clicked(data, event): void {
    /*
    console.log(event);
    if (event.type === 'dblclick') {
      this.mode = this.modes[(this.modes.indexOf(this.mode) + 1) % this.modes.length];
      this.modeChange.emit(this.mode);
    } else {
      if (event.value > 0) {
        this.selected.emit(event);
      }
    }
     */
    this.zone.runOutsideAngular(() => {
      if (data.value > 0) {
        // this.selected.emit(data);
        this.mark(event.target);
      }
    });
  }

  mark(element: HTMLElement): void {
    const marker = 'marked';
    const classList = element.classList;
    classList.contains('marked') ? classList.remove(marker) : classList.add(marker);
  }

  panned(event): void {
    const element = event.target;
    this.zone.runOutsideAngular(() => {
      if (!this.shapes.has(element)) {
        this.shapes.add(element);
        this.mark(element);
      }
    });
  }

  setLabel(value: string): string {
    console.log('change detected');
    return value;
  }
}
