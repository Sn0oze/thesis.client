import { ChangeDetectionStrategy, Component, effect, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'profile-page',
  standalone: true,
  templateUrl: './profile.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  public id = input.required({transform: numberAttribute});

  constructor() {
    effect(() => {
      console.log(this.id(), typeof this.id());
    });
  }
}
