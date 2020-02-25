import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {CalendarCell, CalendarHeader} from '../../../models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Output() selected = new EventEmitter<any>();
  @Input() header: CalendarHeader[];
  @Input() body: Array<CalendarCell>[];
  @Input() totals: number[];
  @ViewChild('scroll') scrollRef: ElementRef<HTMLElement>;
  scrollElement: Element;
  labels: string[];
  max: number;
  readonly cellWidth = 37;
  readonly min = 0;

  constructor() { }

  ngOnInit(): void {
    const now = moment();
    const hours = Array.from({length: 24}, (v, k) => k);

    this.labels = hours.map((h, i) => {
      return now.hour(i).minute(60).format('HH:mm');
    });
  }

  ngAfterViewInit(): void {
    this.scrollElement = this.scrollRef.nativeElement;
    this.max = this.scrollElement.scrollWidth - this.scrollElement.clientWidth;
    console.log(this.scrollElement.scrollWidth, this.scrollElement.clientWidth, this.max);
  }

  public picked(day: CalendarCell): void {
    if (day.value > 0) {
      this.selected.emit(day);
    }
  }

  next(): void {
    if (this.scrollElement.scrollLeft + this.cellWidth <= this.max) {
      this.scrollElement.scrollLeft += this.cellWidth;
    }
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
}
