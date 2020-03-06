import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {DrawCanvas} from '../draw-canvas';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  canvasContainer: HTMLElement;
  canvas: DrawCanvas;
  constructor( private zone: NgZone) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasContainer = this.canvasContainerRef.nativeElement;
      this.canvas = new DrawCanvas(this.canvasContainer);
    });
  }
}
