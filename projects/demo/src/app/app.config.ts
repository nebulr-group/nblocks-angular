import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NblocksConfig, NblocksModule } from '@nblocks/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...NblocksModule.forRoot({
      appId: '671279b938f34e0008b0f80b',  // Replace with your actual app ID
      authBaseUrl: 'https://auth.nblocks.cloud',
      defaultRedirectRoute: '/',
      loginRoute: '/nblocks/auth/login',        
    } as NblocksConfig).providers || []
  ]
};
