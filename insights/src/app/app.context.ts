import { Injectable, signal } from '@angular/core';

type PageOrientation = 'horizontal' | 'vertical';

@Injectable()
export class AppContext {
  private _orientation = signal<PageOrientation>('horizontal');
  public orientation = this._orientation.asReadonly();

  public toggle(): void {
    this._orientation.update(orientation => orientation === 'horizontal' ? 'vertical' : 'horizontal');
  }

}
