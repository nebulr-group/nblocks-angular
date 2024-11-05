import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessTokenLogComponent } from './components/access-token-log.component';
import { CallbackComponent } from './components/callback.component';
import { FeatureFlagComponent } from './components/feature-flag.component';
import { LoginComponent } from './components/login.component';
import { LogoutComponent } from './components/logout.component';
import { SubscriptionComponent } from './components/subscription.component';
import { TeamComponent } from './components/team.component';
import { ProtectedRouteGuard } from './guards/protected-route.guard';
import { FlagsService } from './services/flags.service';
import { LogService } from './services/log.service';
import { NblocksClientService } from './services/nblocks-client.service';
import { NblocksConfigService } from './services/nblocks-config.service';
import { TokenRefresherService } from './services/token-refresher.service';
import { TokenService } from './services/token.service';
import { NblocksPluginConfig } from '@nebulr-group/nblocks-ts-client/engine';

@NgModule({
  declarations: [
    AccessTokenLogComponent,
    CallbackComponent,
    FeatureFlagComponent,
    LoginComponent,
    LogoutComponent,    
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
    SubscriptionComponent,
    TeamComponent
  ],
  providers: [
    ProtectedRouteGuard,
    TokenRefresherService
  ]
})
export class NblocksModule {
  static forRoot(config: Partial<NblocksPluginConfig>): ModuleWithProviders<NblocksModule> {
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
