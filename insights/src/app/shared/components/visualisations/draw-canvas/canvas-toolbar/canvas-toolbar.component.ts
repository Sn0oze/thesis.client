import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PEN_COLOR_KEY, PEN_WIDTH_KEY, PEN_WIDTHS} from '../../../../constants';
import {collapseHorizontal} from '../../../../animations';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss'],
  animations: [collapseHorizontal],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasToolbarComponent implements OnInit {
  @Input() width: string;
  @Input() color: string;
  @Input() colors: Array<string>;
  @Input() isOpen: boolean;
  @Output() colorChange = new EventEmitter<string>();
  @Output() widthChange = new EventEmitter<string>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();
  widths = PEN_WIDTHS;

  constructor() { }

  ngOnInit(): void {}

  changeColor(color: string): void {
    this.color = color;
    this.setColor(color);
    this.colorChange.emit(color);
  }

  changeWidth(): void {
    this.setWidth(this.width);
    this.widthChange.emit(this.width);
  }
  open(): void {
    this.isOpen = true;
    this.opened.emit();
  }
  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }
  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  setWidth(width: string): void {
    localStorage.setItem(PEN_WIDTH_KEY, width);
  }

  setColor(color: string): void {
    localStorage.setItem(PEN_COLOR_KEY, color);
  }
}
