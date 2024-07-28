import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'profiles',
        pathMatch: 'full'
      },
      {
        path:'profiles',
        loadChildren: () => import('../pages/profiles/profile.routes').then(m => m.routes)
      }
    ]
  }
];
