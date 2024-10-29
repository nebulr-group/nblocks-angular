import { Injectable, OnDestroy } from '@angular/core';
import { TokenService } from './token.service';
import { NblocksClientService } from './nblocks-client.service';
import { LogService } from './log.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TokenRefresher } from '../core/token-refresher';

@Injectable({
  providedIn: 'root'
})
export class TokenRefresherService implements OnDestroy {
  private tokenRefresher: TokenRefresher;
  private refreshSubscription: Subscription | null = null;

  constructor(
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private logService: LogService,
    private router: Router
  ) {
    const nblocksClient = this.nblocksClientService.getNblocksClient();

    this.tokenRefresher = new TokenRefresher({
      isRestrictedPath: () => this.isRestrictedPath(),
      getTokenExpiration: (token) => nblocksClient.auth.contextHelper.getTokenExpiration(token),
      refreshTokens: async (refreshToken) => {
        const response = await nblocksClient.auth.refreshTokensAndVerify(refreshToken);
        return {
          access_token: response.tokens.access_token,
          refresh_token: response.tokens.refresh_token,
          id_token: response.tokens.id_token,
          expires_in: response.tokens.expires_in
        };
      },
      onLog: (message) => this.logService.log(message),
      onError: (error) => console.error(error)
    });

    this.setupTokenRefresh();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.tokenRefresher.stopRefreshCycle();
  }

  private setupTokenRefresh() {
    this.refreshSubscription = this.tokenService.refreshToken$
      .pipe(filter(refreshToken => !!refreshToken))
      .subscribe(refreshToken => {
        this.tokenRefresher.startRefreshCycle(refreshToken);
      });
  }

  private isRestrictedPath(): boolean {
    const restrictedPaths = ['/login', '/logout', '/auth/callback'];
    const currentPath = this.router.url;
    return restrictedPaths.some(path => currentPath.startsWith(path));
  }

  clearExpiredTokens() {
    this.tokenService.clearExpiredTokens();
  }
}
