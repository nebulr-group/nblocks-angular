import { Component, Inject } from '@angular/core';
import { NblocksConfig } from '../../models/nblocks-config.interface';
import { NBLOCKS_CONFIG } from '../../tokens/nblocks-tokens';

@Component({
  selector: 'nblocks-login',
  standalone: true,
  template: ''
})
export class LoginComponent {
  constructor(
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig
  ) {
    const callbackUrl = this.config.callbackUrl || `${window.location.origin}/auth/callback`;
    const loginUrl = `${this.config.authBaseUrl}/url/login/${this.config.appId}?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    
    window.location.href = loginUrl;
  }
} 