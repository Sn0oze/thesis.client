import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable()
export class AppManager {
  constructor(private iconRegistry: MatIconRegistry) {
    this.initialize();
  }

  public initialize(): void {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
