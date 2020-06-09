import {AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DrawCanvas} from '../draw-canvas';
import {CELL_WIDTH} from '../../../constants';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  @Input() color: string;
  @Input() width: string;
  @Input() canvasWidth: number;
  canvasContainer: HTMLElement;
  canvas: DrawCanvas;
  max: number;
  readonly cellWidth = CELL_WIDTH;
  readonly min = 0;
  constructor( private zone: NgZone) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasContainer = this.canvasContainerRef.nativeElement;
      this.canvas = new DrawCanvas(this.canvasContainer, this.color, this.width, this.canvasWidth);
      this.max = this.canvasContainer.scrollWidth;
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
  undo(): void {
    this.canvas.undo();
  }

  clear(): void {
    this.canvas.clear();
  }

  scrollTo(position: number): void {
    if ((position >= this.min && position <= this.max)) {
      this.canvasContainer.scrollLeft = position * this.cellWidth;
    }
  }
}
