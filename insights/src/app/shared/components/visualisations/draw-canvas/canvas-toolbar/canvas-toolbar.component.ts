import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COLORS, PEN_WIDTHS} from '../../../../constants';
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
  @Output() colorChange = new EventEmitter<string>();
  @Output() widthChange = new EventEmitter<string>();
  colors = COLORS;
  widths = PEN_WIDTHS;
  isOpen = false;

  constructor() { }

  ngOnInit(): void {}

  changeColor(color: string): void {
    this.color = color;
    this.colorChange.emit(color);
  }

  changeWidth(): void {
    this.widthChange.emit(this.width);
  }
  open(): void {
    this.isOpen = true;
  }
  close(): void {
    this.isOpen = false;
  }
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
