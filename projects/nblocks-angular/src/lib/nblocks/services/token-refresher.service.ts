import { Injectable, OnDestroy } from '@angular/core';
import { TokenService } from './token.service';
import { NblocksClientService } from './nblocks-client.service';
import { LogService } from './log.service';
import { NblocksConfigService } from './nblocks-config.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenRefresherService implements OnDestroy {
  private refreshSubscription: Subscription | null = null;
  private readonly retrySec = 60;

  constructor(
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private logService: LogService,
    private configService: NblocksConfigService,
    private router: Router
  ) {
    this.setupTokenRefresh();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private setupTokenRefresh() {
    this.refreshSubscription = this.tokenService.refreshToken$
      .pipe(
        filter(refreshToken => !!refreshToken && !this.isRestrictedPath()),
        switchMap(refreshToken => this.refreshTokens(refreshToken!))
      )
      .subscribe();
  }

  private refreshTokens(refreshToken: string) {
    return timer(0, this.retrySec * 1000).pipe(
      switchMap(async () => {
        try {
          const nblocksClient = this.nblocksClientService.getNblocksClient();
          const { tokens } = await nblocksClient.auth.refreshTokensAndVerify(refreshToken);
          
          this.tokenService.setAccessToken(tokens.access_token);
          this.tokenService.setRefreshToken(tokens.refresh_token);
          if (tokens.id_token) {
            this.tokenService.setIdToken(tokens.id_token);
          }

          const expiresIn = Math.floor(tokens.expires_in * 0.9);
          this.logService.log(`Tokens refreshed, scheduling new refresh in ${expiresIn} s because token expires in ${tokens.expires_in} s`);
          return expiresIn * 1000;
        } catch (error) {
          console.error(error);
          this.logService.log(`Due to previous error! Trying another refresh in ${this.retrySec}s`);
          return this.retrySec * 1000;
        }
      })
    );
  }

  private isRestrictedPath(): boolean {
    const restrictedPaths = ['/login', '/logout', '/auth/callback'];
    const currentPath = this.router.url;
    return restrictedPaths.some(path => currentPath.startsWith(path));
  }

  clearExpiredTokens() {
    const nblocksClient = this.nblocksClientService.getNblocksClient();
    const now = new Date().getTime();

    this.tokenService.refreshToken$.pipe(filter(token => !!token)).subscribe(token => {
      if (now > nblocksClient.auth.contextHelper.getTokenExpiration(token!) * 1000) {
        this.logService.log('Expired refresh token. Removing!');
        this.tokenService.setRefreshToken(undefined);
      }
    });

    this.tokenService.accessToken$.pipe(filter(token => !!token)).subscribe(token => {
      if (now > nblocksClient.auth.contextHelper.getTokenExpiration(token!) * 1000) {
        this.logService.log('Expired access token. Removing!');
        this.tokenService.setAccessToken(undefined);
      }
    });
  }
}
