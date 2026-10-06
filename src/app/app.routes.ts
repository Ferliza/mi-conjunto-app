import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./detalle/detalle.page').then((m) => m.DetallePage),
  },
  {
    path: 'detalle',
    loadComponent: () => import('./detalle/detalle.page').then( m => m.DetallePage)
  },
];
