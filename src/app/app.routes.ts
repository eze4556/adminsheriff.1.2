import { Routes } from '@angular/router';

export const routes: Routes = [

   {
    path: 'login',
    loadComponent: () => import('../../src/app/views/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'aplicaciones',
    loadComponent: () => import('../../src/app/views/apk/apk.component').then(m => m.ApkComponent)
  },
  {
    path: 'lista',
    loadComponent: () => import('../../src/app/views/apklist/apklist.component').then(m => m.ApkListComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../../src/app/views/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'lonja',
    loadComponent: () => import('./views/user-detail/user-detail.page').then((m) => m.UserDetailPage),
  },
   {
    path: 'ver-usuario/:id',
    loadComponent: () => import('./views/ver-usuario/ver-usuario.component').then(m => m.VerUsuarioComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
