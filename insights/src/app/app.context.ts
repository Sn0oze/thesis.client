import { Injectable, signal } from '@angular/core';

type PageOrientation = 'landscape' | 'portrait';

@Injectable()
export class AppContext {
  private _orientation = signal<PageOrientation>('landscape');
  public orientation = this._orientation.asReadonly();

  public toggle(): void {
    this._orientation.update(orientation => orientation === 'landscape' ? 'portrait' : 'landscape');
  }

}
