import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef, HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DrawCanvas} from '../draw-canvas';
import {CELL_WIDTH} from '../../../constants';
import {CanvasSessionService} from '../../../services/canvas-session.service';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.scss']
})
export class DrawCanvasComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, AfterViewChecked {
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  @Input() color: string;
  @Input() width: string;
  @Input() canvasWidth: number;
  @Input() initialPosition: number;
  canvasContainer: HTMLElement;
  canvas: DrawCanvas;
  max: number;
  positionSet: boolean;
  readonly cellWidth = CELL_WIDTH;
  readonly min = 0;

  constructor(
    private zone: NgZone,
    private session: CanvasSessionService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasContainer = this.canvasContainerRef.nativeElement;
      this.canvas = new DrawCanvas(this.canvasContainer, this.color, this.width, this.canvasWidth, this.session.current);
      this.max = this.canvasContainer.scrollWidth;
    });
  }

  ngAfterViewChecked() {
    if (!this.positionSet) {
      this.zone.runOutsideAngular(() => {
        this.scrollTo(this.initialPosition);
        this.positionSet = true;
      });
    }
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

  ngOnDestroy() {
    this.session.save(this.canvas.session);
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    this.session.save(this.canvas.session);
  }
}
