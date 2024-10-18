import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NblocksConfig } from './models/nblocks-config.model';
import { NblocksConfigService } from './services/nblocks-config.service';
import { TokenService } from './services/token.service';
import { LogService } from './services/log.service';
import { NblocksClientService } from './services/nblocks-client.service';
import { FlagsService } from './services/flags.service';
import { TokenRefresherService } from './services/token-refresher.service';
import { AccessTokenLogComponent } from './components/access-token-log.component';
import { CallbackComponent } from './components/callback.component';
import { FeatureFlagComponent } from './components/feature-flag.component';
import { LoginComponent } from './components/login.component';
import { LogoutComponent } from './components/logout.component';
import { ExternalRedirectComponent } from './components/external-redirect.component';
import { SubscriptionComponent } from './components/subscription.component';
import { TeamComponent } from './components/team.component';
import { ProtectedRouteGuard } from './guards/protected-route.guard';

@NgModule({
  declarations: [
    AccessTokenLogComponent,
    CallbackComponent,
    FeatureFlagComponent,
    LoginComponent,
    LogoutComponent,
    ExternalRedirectComponent,
    SubscriptionComponent,
    TeamComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AccessTokenLogComponent,
    CallbackComponent,
    FeatureFlagComponent,
    LoginComponent,
    LogoutComponent,
    ExternalRedirectComponent,
    SubscriptionComponent,
    TeamComponent
  ],
  providers: [
    ProtectedRouteGuard,
    TokenRefresherService
  ]
})
export class NblocksModule {
  static forRoot(config: NblocksConfig): ModuleWithProviders<NblocksModule> {
    return {
      ngModule: NblocksModule,
      providers: [
        {
          provide: NblocksConfigService,
          useFactory: () => {
            const configService = new NblocksConfigService();
            configService.setConfig(config);
            return configService;
          }
        },
        TokenService,
        LogService,
        NblocksClientService,
        FlagsService,
        TokenRefresherService
      ]
    };
  }
}
