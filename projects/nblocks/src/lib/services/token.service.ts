import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as jose from 'jose';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService implements OnDestroy {
  private readonly ACCESS_TOKEN_KEY = 'nblocks_access_token';
  private readonly REFRESH_TOKEN_KEY = 'nblocks_refresh_token';
  private readonly ID_TOKEN_KEY = 'nblocks_id_token';
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
  

  private accessTokenSubject = new BehaviorSubject<string | null>(this.getStoredAccessToken());
  private refreshTokenSubject = new BehaviorSubject<string | null>(this.getStoredRefreshToken());
  private idTokenSubject = new BehaviorSubject<string | null>(this.getStoredIdToken());
  private refreshCheckSubscription?: Subscription;
  private isRefreshing = false;

  constructor(@Inject(NBLOCKS_CONFIG) private config: NblocksConfig) {
    // Start monitoring token expiry
    this.scheduleNextCheck();

    // Also check when tokens change
    this.accessTokenSubject.subscribe(() => {
      this.scheduleNextCheck();
    });
  }

  ngOnDestroy() {
    this.stopExpiryCheck();
  }

  /**
   * Store tokens and update observables
   */
  storeTokens(tokens: TokenSet | { access_token: string; refresh_token: string; id_token: string }): void {
    const normalizedTokens = this.normalizeTokens(tokens);
    
    // Store in localStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, normalizedTokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, normalizedTokens.refreshToken);
    localStorage.setItem(this.ID_TOKEN_KEY, normalizedTokens.idToken);

    // Update observables
    this.accessTokenSubject.next(normalizedTokens.accessToken);
    this.refreshTokenSubject.next(normalizedTokens.refreshToken);
    this.idTokenSubject.next(normalizedTokens.idToken);
  }

  private normalizeTokens(tokens: TokenSet | { access_token: string; refresh_token: string; id_token: string }): TokenSet {
    if ('access_token' in tokens) {
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token
      };
    }
    return tokens;
  }

  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ID_TOKEN_KEY);

    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.idTokenSubject.next(null);
  }

  /**
   * Get the stored access token
   */
  getStoredAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get the stored refresh token
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get the stored ID token
   */
  getStoredIdToken(): string | null {
    return localStorage.getItem(this.ID_TOKEN_KEY);
  }

  /**
   * Observable for access token changes
   */
  accessToken$(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }

  /**
   * Observable for refresh token changes
   */
  refreshToken$(): Observable<string | null> {
    return this.refreshTokenSubject.asObservable();
  }

  /**
   * Observable for ID token changes
   */
  idToken$(): Observable<string | null> {
    return this.idTokenSubject.asObservable();
  }

  /**
   * Check if the access token is expired
   */
  async isAccessTokenExpired(): Promise<boolean> {
    const token = this.getStoredAccessToken();
    if (!token) return true;

    try {
      const { exp } = jose.decodeJwt(token);
      if (!exp) return true;

      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  /**
   * Check if the user is authenticated (has valid tokens)
   */
  async isAuthenticated(): Promise<boolean> {
    return !(await this.isAccessTokenExpired());
  }

  async setTokens(tokens: TokenSet): Promise<void> {
    this.accessTokenSubject.next(tokens.accessToken);
    this.refreshTokenSubject.next(tokens.refreshToken);
    this.idTokenSubject.next(tokens.idToken);
  }

  /**
   * Get the contents of the ID token
   */
  getIdTokenContents(): string | null {
    return this.idTokenSubject.getValue();
  }

  /**
   * Get token expiry time in milliseconds
   */
  private getTokenExpiryTime(token: string): number | null {
    try {
      const { exp } = jose.decodeJwt(token);
      return exp ? exp * 1000 : null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate the next check interval based on time until expiry
   */
  private getNextCheckInterval(timeUntilExpiry: number): number {
    // If we're outside the refresh threshold, schedule check just before we hit the threshold
    if (timeUntilExpiry > this.REFRESH_THRESHOLD) {
      return timeUntilExpiry - this.REFRESH_THRESHOLD;
    }
    
    // If we're within refresh threshold, check at halfway point to expiry
    return Math.max(timeUntilExpiry / 2, 10000); // Minimum 10 seconds between checks
  }

  /**
   * Schedule the next expiry check based on current token state
   */
  private scheduleNextCheck() {
    // Clear existing check if any
    if (this.refreshCheckSubscription) {
      this.refreshCheckSubscription.unsubscribe();
    }

    const token = this.getStoredAccessToken();
    if (!token) {
      console.log('No token available - skipping check schedule');
      return; // No token to check
    }

    const expiryTime = this.getTokenExpiryTime(token);
    if (!expiryTime) {
      console.log('Invalid token - skipping check schedule');
      return; // Invalid token
    }

    const timeUntilExpiry = expiryTime - Date.now();
    if (timeUntilExpiry <= 0) {
      console.log('Token already expired - skipping check schedule');
      return; // Token already expired
    }

    // Schedule next check based on how close we are to expiry
    const nextCheckInterval = this.getNextCheckInterval(timeUntilExpiry);
    
    const minutes = Math.floor(timeUntilExpiry / 60000);
    const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);
    const checkMinutes = Math.floor(nextCheckInterval / 60000);
    const checkSeconds = Math.floor((nextCheckInterval % 60000) / 1000);
    
    console.log(
      `Token expires in ${minutes}m ${seconds}s. ` +
      `Scheduling next check in ${checkMinutes}m ${checkSeconds}s` +
      `${timeUntilExpiry <= this.REFRESH_THRESHOLD ? ' (Within refresh threshold)' : ''}`
    );

    this.refreshCheckSubscription = timer(nextCheckInterval)
      .subscribe(() => {
        this.checkAndRefreshToken();
        // Schedule next check after this one completes
        this.scheduleNextCheck();
      });
  }

  /**
   * Stop monitoring token expiry
   */
  private stopExpiryCheck() {
    if (this.refreshCheckSubscription) {
      this.refreshCheckSubscription.unsubscribe();
    }
  }

  /**
   * Check if token needs refresh and refresh if needed
   */
  private async checkAndRefreshToken() {
    if (this.isRefreshing) return;

    const token = this.getStoredAccessToken();
    if (!token) return;

    const expiryTime = this.getTokenExpiryTime(token);
    if (!expiryTime) return;

    const timeUntilExpiry = expiryTime - Date.now();
    console.log('timeUntilExpiry (seconds)', timeUntilExpiry / 1000);
    
    // Refresh if token expires in less than REFRESH_THRESHOLD
    if (timeUntilExpiry < this.REFRESH_THRESHOLD) {
      await this.refreshToken();
    }
  }

  /**
   * Refresh the token
   */
  async refreshToken(): Promise<void> {
    if (this.isRefreshing) return;

    try {
      this.isRefreshing = true;
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.config.authBaseUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.appId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
      }).then(res => res.json());

      this.storeTokens(response);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear tokens if refresh fails
      this.clearTokens();
    } finally {
      this.isRefreshing = false;
    }
  }
} 