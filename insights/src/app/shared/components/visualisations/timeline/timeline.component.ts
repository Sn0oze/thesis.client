import {AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Timeline} from '../timeline';
import {DataSet} from '../../../models';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef: ElementRef;
  @Input() dataSet: DataSet;
  container: HTMLElement;
  timeline: Timeline;
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.container = this.containerRef.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.timeline = new Timeline(this.container, this.dataSet);
    });
  }
}
