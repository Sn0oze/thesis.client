import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppManager } from './app.manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `
})
export class AppComponent {
  private _manager = inject(AppManager);

  constructor() {
    this._manager.initialize();
  }
}
