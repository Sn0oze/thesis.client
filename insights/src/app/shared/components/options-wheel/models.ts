import {InjectionToken} from '@angular/core';

export type WheelAction = 'annotate' | 'filter' | 'trim' | 'initial';

export const WHEEL_CONFIG_DATA = new InjectionToken<{}>('WHEEL_CONFIG_DATA');

export interface WheelConfig {
  canAnnotate?: boolean;
  canFilter?: boolean;
  canTrim?: boolean;
}
