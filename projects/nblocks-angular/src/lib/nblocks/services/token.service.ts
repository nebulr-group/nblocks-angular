import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenManager } from '../core/token-manager';
import { NblocksClientService } from './nblocks-client.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements OnDestroy {
  private tokenManager: TokenManager;
  private accessTokenSubject = new BehaviorSubject<string | undefined>(undefined);
  private idTokenSubject = new BehaviorSubject<string | undefined>(undefined);
  private refreshTokenSubject = new BehaviorSubject<string | undefined>(undefined);

  accessToken$: Observable<string | undefined> = this.accessTokenSubject.asObservable();
  idToken$: Observable<string | undefined> = this.idTokenSubject.asObservable();
  refreshToken$: Observable<string | undefined> = this.refreshTokenSubject.asObservable();

  private unsubscribers: (() => void)[] = [];

  constructor(nblocksClientService: NblocksClientService) {
    const nblocksClient = nblocksClientService.getNblocksClient();
    
    this.tokenManager = new TokenManager(localStorage, {
      getTokenExpiration: (token) => nblocksClient.auth.contextHelper.getTokenExpiration(token)
    });
    
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
  }

  private setupSubscriptions() {
    this.unsubscribers.push(
      this.tokenManager.subscribe('access', token => this.accessTokenSubject.next(token)),
      this.tokenManager.subscribe('id', token => this.idTokenSubject.next(token)),
      this.tokenManager.subscribe('refresh', token => this.refreshTokenSubject.next(token))
    );
  }

  setAccessToken(token: string | undefined) {
    this.tokenManager.setToken('access', token);
  }

  setIdToken(token: string | undefined) {
    this.tokenManager.setToken('id', token);
  }

  setRefreshToken(token: string | undefined) {
    this.tokenManager.setToken('refresh', token);
  }

  getAccessToken(): string | undefined {
    return this.tokenManager.getToken('access');
  }

  getRefreshToken(): string | undefined {
    return this.tokenManager.getToken('refresh');
  }

  getIdToken(): string | undefined {
    return this.tokenManager.getToken('id');
  }

  destroyTokens() {
    this.tokenManager.destroyTokens();
  }

  clearExpiredTokens() {
    this.tokenManager.clearExpiredTokens();
  }
}
