import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { GameComponent } from './views/game/game.component';

export const routes: Routes = [
    {
        path: '',
        component: GameComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        loadComponent: () => import('./views/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'message',
        loadComponent: () => import('./views/message/message.component').then(m => m.MessageComponent)
    },
    {
        path: 'location',
        loadComponent: () => import('./views/location/location.component').then(m => m.LocationComponent)
    },
    {
        path: 'more-details',
        loadComponent: () => import('./views/more-details/more-details.component').then(m => m.MoreDetailsComponent)
    },
    {
        path: 'payment-check',
        loadComponent: () => import('./views/payment-check/payment-check.component').then(m => m.PaymentCheckComponent)
    },
    {
        path: 'rewards',
        loadComponent: () => import('./views/rewards/rewards.component').then(m => m.RewardsComponent)
    },
    //Admin
    {
        path: 'admin',
        loadComponent: () => import('./views/Admin/pedidos/pedidos.component').then(m => m.PedidosComponent)
    },
    {
        path: 'categorias',
        loadComponent: () => import('./views/Admin/categorias/categorias.component').then(m => m.CategoriasComponent)
    },
    {
        path: 'productos',
        loadComponent: () => import('./views/Admin/producto/producto.component').then(m => m.ProductoComponent)
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./views/Admin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
    },
    {
        path: 'referidos',
        loadComponent: () => import('./views/Admin/referidos/referidos.component').then(m => m.ReferidosComponent)
    },
    {
        path: 'tienda-premio',
        loadComponent: () => import('./views/Admin/tienda-premio/tienda-premio.component').then(m => m.TiendaPremioComponent)
    },
    {
        path: 'qr',
        loadComponent: () => import('./views/Admin/qr/qr.component').then(m => m.QrComponent)
    },
    {
        path: 'roles',
        loadComponent: () => import('./views/Admin/rol/rol.component').then(m => m.RolComponent)
    }
];
