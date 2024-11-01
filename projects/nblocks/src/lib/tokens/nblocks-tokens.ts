import { InjectionToken } from '@angular/core';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { AuthService } from '../services/auth.service';
import { FeatureFlagService } from '../services/feature-flag.service';
import { TokenService } from '../services/token.service';

export const NBLOCKS_CONFIG = new InjectionToken<NblocksConfig>('NBLOCKS_CONFIG');
export const NBLOCKS_TOKEN_SERVICE = new InjectionToken<TokenService>('NBLOCKS_TOKEN_SERVICE');
export const NBLOCKS_FEATURE_FLAG_SERVICE = new InjectionToken<FeatureFlagService>('NBLOCKS_FEATURE_FLAG_SERVICE');
export const NBLOCKS_AUTH_SERVICE = new InjectionToken<AuthService>('NBLOCKS_AUTH_SERVICE');

export const DEFAULT_CONFIG: Partial<NblocksConfig> = {
  authBaseUrl: 'https://auth.nblocks.cloud',
  defaultRedirectRoute: '/',
  loginRoute: '/login'
}; 