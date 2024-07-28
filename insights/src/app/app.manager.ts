import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable()
export class AppManager {
  private _iconRegistry = inject(MatIconRegistry)

  public initialize(): void {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
