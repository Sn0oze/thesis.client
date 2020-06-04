import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Timeline, TimeSpan} from '../timeline';
import {DataSet} from '../../../models';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container') containerRef: ElementRef;
  @Input() dataSet: DataSet;
  @Output() selected = new EventEmitter<TimeSpan>();
  container: HTMLElement;
  timeline: Timeline;
  subscription: Subscription;
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.container = this.containerRef.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.timeline = new Timeline(this.container, this.dataSet);
      this.subscription = this.timeline.selection.subscribe(span => this.selected.emit(span));
    });
  }

 ngOnChanges(changes: SimpleChanges) {
    if (this.timeline) {
      this.zone.runOutsideAngular(() => {
        this.timeline.update(this.dataSet);
      });
    }
 }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
