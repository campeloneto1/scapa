import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    loadChildren: () => import('./sistema/sistema.module').then((m) => m.SistemaModule),
    
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
