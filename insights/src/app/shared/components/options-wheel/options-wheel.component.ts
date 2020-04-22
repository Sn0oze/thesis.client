import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {WheelActionService} from './wheel-action.service';
import {WHEEL_CONFIG_DATA, WheelAction, WheelConfig} from './models';

@Component({
  selector: 'app-options-wheel',
  templateUrl: './options-wheel.component.html',
  styleUrls: ['./options-wheel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsWheelComponent implements OnInit {
  hasTrimmed: boolean;
  categories: Array<string>;

  constructor(
    private action: WheelActionService,
    @Inject(WHEEL_CONFIG_DATA) public config: WheelConfig
  ) { }

  ngOnInit(): void {
    this.categories = ['work', 'weekend', 'evening', 'holiday'];
  }

  selected(option: WheelAction): void {
    this.action.next(option);
    if (option === 'trim') {
      this.hasTrimmed = true;
    }
  }
}
