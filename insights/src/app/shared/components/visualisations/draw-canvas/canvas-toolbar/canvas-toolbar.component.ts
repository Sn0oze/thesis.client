import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fadeInOut, fadeInStagger} from '../../../../animations';
import {COLORS, PEN_WIDTHS} from '../../../../constants';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss'],
  animations: [fadeInStagger, fadeInOut]
})
export class CanvasToolbarComponent implements OnInit {
  @Input() width: string;
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();
  @Output() widthChange = new EventEmitter<string>();
  colors = COLORS;
  widths = PEN_WIDTHS;

  constructor() { }

  ngOnInit(): void {}

  changeColor(color: string): void {
    this.color = color;
    this.colorChange.emit(color);
  }

  changeWidth(): void {
    this.widthChange.emit(this.width);
  }
}
