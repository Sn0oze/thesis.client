import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export type WheelOption = 'annotate' | 'filter' | 'trim';

@Component({
  selector: 'app-options-wheel',
  templateUrl: './options-wheel.component.html',
  styleUrls: ['./options-wheel.component.scss']
})
export class OptionsWheelComponent implements OnInit {
  @Output() trim = new EventEmitter<void>();
  @Output() annotate = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();
  isOpen: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  action(option: WheelOption): void {
    switch (option) {
      case 'annotate':
        this.annotate.emit();
        break;
      case 'filter':
        this.filter.emit();
        break;
      case 'trim':
        this.trim.emit();
    }
  }

  open(): void {
    console.log('open');
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
