import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';
import { TokenService, TokenSet } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig
  ) {
    // Convert the Promise-based isAuthenticated to an Observable
    this.isAuthenticated$ = this.tokenService.accessToken$().pipe(
      switchMap(() => from(this.tokenService.isAuthenticated()))
    );
  }

  async login(options: { redirectUri: string }) {
    const loginUrl = `${this.config.authBaseUrl}/url/login/${this.config.appId}?redirect_uri=${encodeURIComponent(options.redirectUri)}`;
    window.location.href = loginUrl;
  }

  async handleCallback(code: string): Promise<void> {
    if (!code) {
      throw new Error('No authorization code provided');
    }

    const tokens = await this.exchangeCode(code);
    this.tokenService.storeTokens(tokens);
  }

  logout(): void {
    this.tokenService.clearTokens();
  }

  private async exchangeCode(code: string): Promise<TokenSet> {
    const url = `${this.config.authBaseUrl}/token/code/${this.config.appId}`;
    return firstValueFrom(
      this.http.post<TokenSet>(url, { code })
    );
  }
} 