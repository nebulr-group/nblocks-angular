import { Routes } from '@angular/router';
import { CallbackComponent, LoginComponent, TeamComponent, featureFlagGuard, protectedRoute } from '@nblocks/angular';
import { BetaFeatureComponent } from './beta-feature/beta-feature.component';
import { TeamPageComponent } from './pages/team/team.page';
import { ProtectedPageComponent } from './protected-page/protected-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'protected',
    component: ProtectedPageComponent,
    canActivate: [protectedRoute]
  },
  {
    path: 'beta',
    component: BetaFeatureComponent,
    canActivate: [protectedRoute, featureFlagGuard('beta-feature')]
  },
  {
    path: 'nblocks',
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'oauth-callback',
            component: CallbackComponent
          }
        ]
      },
      {
        path: 'team',
        component: TeamPageComponent,
        canActivate: [protectedRoute]
      }
    ]
  }
  
];
