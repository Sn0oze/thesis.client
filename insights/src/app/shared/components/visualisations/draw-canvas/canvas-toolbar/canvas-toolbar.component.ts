import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {fadeStagger} from '../../../../animations';

@Component({
  selector: 'app-canvas-toolbar',
  templateUrl: './canvas-toolbar.component.html',
  styleUrls: ['./canvas-toolbar.component.scss'],
  animations: [fadeStagger]
})
export class CanvasToolbarComponent implements OnInit {
  @Output() colorPicked = new EventEmitter<string>();
  colors = ['#4c81c1', '#c58145', '#95ba8a'];

  constructor() { }

  ngOnInit(): void {
  }

  changeColor(color: string): void {
   this.colorPicked.emit(color);
  }

}
