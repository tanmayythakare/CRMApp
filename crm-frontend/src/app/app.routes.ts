import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/contacts/contact-list.component').then(m => m.ContactListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/contacts/contact-detail.component').then(m => m.ContactDetailComponent)
      }
    ]
  },
  {
    path: 'interactions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/interactions/interaction-list.component').then(m => m.InteractionListComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
