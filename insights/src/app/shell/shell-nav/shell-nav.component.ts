import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppContext } from '../../app.context';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-shell-nav',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './shell-nav.component.html',
  styleUrl: './shell-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'bg-slate-600',
    '[class]': '_context.orientation()'
  }
})
export class ShellNavComponent {
  protected _context = inject(AppContext);
}
