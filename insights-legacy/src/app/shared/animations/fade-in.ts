import {animate, group, query, stagger, style, transition, trigger} from '@angular/animations';
export const staggerDuration = 25;
export const fadeTiming = '225ms ease-in-out';

export const fadeInOutStagger = trigger('fadeInOutStagger', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(staggerDuration, [
        animate(fadeTiming, style({ opacity: 0 }))
      ])
    ], {optional: true}),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(staggerDuration, [
        animate(fadeTiming, style({ opacity: 1 }))
      ])
    ], {optional: true})
  ])
]);

export const fadeInStagger = trigger('fadeInStagger', [
  transition('* => *', [
    query(':leave', [
      stagger(0, [
        animate(fadeTiming, style({ opacity: 0 }))
      ])
    ], {optional: true}),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(staggerDuration, [
        animate(fadeTiming, style({ opacity: 1 }))
      ])
    ], {optional: true})
  ])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      animate(fadeTiming, style({ opacity: 0 }))
    ],  { optional: true }),
    query(':enter', [
      group([
        style({ opacity: 0 }),
        animate(fadeTiming, style({ opacity: 1 })),
      ])
    ],  { optional: true })
  ])
]);
