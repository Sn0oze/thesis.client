import { inject, Injectable, Signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

type PageOrientation = 'landscape' | 'portrait';

@Injectable()
export class AppContext {
  private _breakPointObserver = inject(BreakpointObserver);
  public orientation: Signal<PageOrientation>;

  constructor() {
    this.orientation = toSignal(
      this._breakPointObserver
        .observe('(orientation: portrait)')
        .pipe(map(state => state.matches ? 'portrait' : 'landscape')),
      {initialValue: 'landscape'}
    );
  }

}
