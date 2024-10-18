import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CallbackComponent, LoginComponent, LogoutComponent, ProtectedRouteGuard } from 'nblocks-angular';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent, // Replace with your actual default component
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
    }

];
