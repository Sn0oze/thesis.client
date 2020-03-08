import {AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DrawCanvas} from '../draw-canvas';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  @Input() color: string;
  @Input() width: string;
  canvasContainer: HTMLElement;
  canvas: DrawCanvas;
  constructor( private zone: NgZone) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasContainer = this.canvasContainerRef.nativeElement;
      this.canvas = new DrawCanvas(this.canvasContainer, this.color, this.width);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const color = changes?.color?.currentValue;
    const width = changes?.width?.currentValue;
    if (this.canvas && color) {
      this.canvas.color = color;
    }
    if (this.canvas && width) {
      this.canvas.strokeWidth = width;
    }
  }
}
