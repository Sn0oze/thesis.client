import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppContext } from '../app.context';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIcon
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '_context.orientation()'
  }
})
export class ShellComponent {
  protected _context = inject(AppContext);
  public toggle(): void {
    this._context.toggle();
  }
}
