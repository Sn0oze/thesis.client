import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {fadeInOut, fadeInStagger} from '../../../../animations';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss'],
  animations: [fadeInStagger, fadeInOut]
})
export class CanvasToolbarComponent implements OnInit {
  @Output() colorPicked = new EventEmitter<string>();
  @Output() widthPicked = new EventEmitter<string>();
  colors = ['#4c81c1', '#c58145', '#95ba8a'];
  width: string;

  constructor() { }

  ngOnInit(): void {
    this.width = '2px';
  }

  changeColor(color: string): void {
   this.colorPicked.emit(color);
  }

  changeWidth(): void {
    this.widthPicked.emit(this.width);
  }
}
