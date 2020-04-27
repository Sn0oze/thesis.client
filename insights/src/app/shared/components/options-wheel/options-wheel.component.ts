import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {WheelActionService} from './wheel-action.service';
import {WHEEL_CONFIG_DATA, WheelAction, WheelConfig} from './models';
import {CategoryService} from '../../services/category.service';

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
    private categoryService: CategoryService,
    @Inject(WHEEL_CONFIG_DATA) public config: WheelConfig
  ) { }

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
  }

  selected(option: WheelAction, data?: any): void {
    const action = {
      action: option,
      data: ''
    };
    switch (option) {
      case 'trim':
        this.hasTrimmed = true;
        break;
      case 'categorize':
        action.data = data;
    }
    this.action.next(action);
  }

  addCategory(category: string): void {
    this.categories = this.categoryService.addCategory(category);
  }
}
