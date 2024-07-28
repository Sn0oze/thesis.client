import { Routes } from '@angular/router';
import { ProfilesPageComponent } from './profiles.page';

export const routes: Routes = [
  {
    path: '',
    component: ProfilesPageComponent
  },
  {
    path: ':id',
    loadComponent: () => import('./profile.page').then(c => c.ProfilePageComponent)
  }
];
