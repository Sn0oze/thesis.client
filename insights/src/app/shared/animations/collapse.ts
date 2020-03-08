import {animate, state, style, transition, trigger} from '@angular/animations';
export  const collapseTiming = '225ms cubic-bezier(0.4,0.0,0.2,1)';

export const collapseHorizontal = trigger('collapseHorizontal', [
  state('true', style({
    width : '0', visibility: 'hidden'
  })),
  state('false', style({
    width : '*', visibility: 'visible'
  })),
  transition('true <=> false', animate(collapseTiming)),
]);

