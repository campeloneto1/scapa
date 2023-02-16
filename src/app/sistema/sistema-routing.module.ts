import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlowedGuard } from "../guards/alowed.guard";
import { SistemaComponent } from "./sistema.component";

const routes: Routes = [
    {
        path: '',
        component: SistemaComponent,
        children: [
            {
                path: 'Inicio',
                loadComponent: () => import('./pages/inicio/inicio.component').then((c) => c.InicioComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Acesso',
                loadComponent: () => import('./pages/acessos/acesso/acesso.component').then((c) => c.AcessoComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Acessos',
                loadComponent: () => import('./pages/acessos/acessos.component').then((c) => c.AcessosComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Estados',
                loadComponent: () => import('./pages/estados/estados.component').then((c) => c.EstadosComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Niveis',
                loadComponent: () => import('./pages/niveis/niveis.component').then((c) => c.NiveisComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Orgaos',
                loadComponent: () => import('./pages/orgaos/orgaos.component').then((c) => c.OrgaosComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Paises',
                loadComponent: () => import('./pages/paises/paises.component').then((c) => c.PaisesComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Pessoas',
                loadComponent: () => import('./pages/pessoas/pessoas.component').then((c) => c.PessoasComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Postos',
                loadComponent: () => import('./pages/postos/postos.component').then((c) => c.PostosComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Setores',
                loadComponent: () => import('./pages/setores/setores.component').then((c) => c.SetoresComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Sexos',
                loadComponent: () => import('./pages/sexos/sexos.component').then((c) => c.SexosComponent),
                canActivate: [AlowedGuard]
            },
            {
                path: 'Usuarios',
                loadComponent: () => import('./pages/usuarios/usuarios.component').then((c) => c.UsuariosComponent),
                canActivate: [AlowedGuard]
            },

            {
                path: '',
                redirectTo: 'Inicio',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'Inicio',
                pathMatch: 'full',
            },
        ]
        
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SistemaRoutingModule{}