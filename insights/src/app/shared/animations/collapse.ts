import {animate, group, query, state, style, transition, trigger} from '@angular/animations';
export  const collapseTiming = '225ms cubic-bezier(0.4,0.0,0.2,1)';

export const collapseHorizontal = trigger('collapseHorizontal', [
  state('true', style({
    width : '0', visibility: 'hidden', opacity: 0
  })),
  state('false', style({
    width : '*', visibility: 'visible', opacity: 1
  })),
  transition('true <=> false', animate(collapseTiming)),
]);

export const collapseLeaveEnter = trigger('collapseLeaveEnter', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      animate(collapseTiming, style({ width : '0', opacity: 0 }))
    ],  { optional: true }),
    query(':enter', [
      group([
        style({ opacity: 0 }),
        animate(collapseTiming, style({ width : '*', opacity: 1 })),
      ])
    ],  { optional: true })
  ])
]);

