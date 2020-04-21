import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WheelActionService} from './wheel-action.service';
import {WheelAction} from './models';

@Component({
  selector: 'app-options-wheel',
  templateUrl: './options-wheel.component.html',
  styleUrls: ['./options-wheel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsWheelComponent implements OnInit {
  @Output() trim = new EventEmitter<void>();
  @Output() annotate = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();
  constructor(private action: WheelActionService) { }

  ngOnInit(): void {
  }

  selected(option: WheelAction): void {
    this.action.next(option);
  }
}
