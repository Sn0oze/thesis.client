import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'profiles-page',
  standalone: true,
  templateUrl: './profiles.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfilesPageComponent {
}
