import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent, LoginComponent, LogoutComponent, ProtectedRouteGuard } from 'nblocks-angular';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [ProtectedRouteGuard]
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'logout',
        component: LogoutComponent
    },
    {
        path:'auth/oauth-callback',
        component: CallbackComponent
    },
];
