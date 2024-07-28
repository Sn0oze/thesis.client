import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./shell/shell.routes').then(module => module.routes)
  }
];
