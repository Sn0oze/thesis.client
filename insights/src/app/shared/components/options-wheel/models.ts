import {InjectionToken} from '@angular/core';
import {Category} from '../../models';

export type WheelAction = 'annotate' | 'filter' | 'trim' | 'initial' | 'categorize';

export const WHEEL_CONFIG_DATA = new InjectionToken<{}>('WHEEL_CONFIG_DATA');

export interface WheelConfig {
  annotate?: boolean;
  filter?: boolean;
  trim?: boolean;
  categorize?: boolean;
}

export interface WheelData {
  action: WheelAction;
  data?: Category;
}
