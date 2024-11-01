import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CallbackComponent } from './components/callback/callback.component';
import { LoginComponent } from './components/login/login.component';
import { FeatureFlagDirective } from './directives/feature-flag.directive';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NblocksConfig } from './models/nblocks-config.interface';
import { DEFAULT_CONFIG, NBLOCKS_CONFIG } from './tokens/nblocks-tokens';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    LoginComponent,
    CallbackComponent,
    FeatureFlagDirective
  ],
  exports: [
    LoginComponent,
    CallbackComponent,
    FeatureFlagDirective
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class NblocksModule {
  static forRoot(config: NblocksConfig): ModuleWithProviders<NblocksModule> {
    return {
      ngModule: NblocksModule,
      providers: [
        {
          provide: NBLOCKS_CONFIG,
          useValue: { ...DEFAULT_CONFIG, ...config }
        }
      ]
    };
  }
} 