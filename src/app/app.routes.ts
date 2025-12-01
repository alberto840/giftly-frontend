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
    }
];
