import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppContext } from '../app.context';
import { ShellNavComponent } from './shell-nav/shell-nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    ShellNavComponent
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
}
