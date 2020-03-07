import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
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
  transition('* => *', [ // each time the binding value changes
    query(':enter', [
      style({ opacity: 0 }),
      stagger(staggerDuration, [
        animate(fadeTiming, style({ opacity: 1 }))
      ])
    ], {optional: true})
  ])
]);
