import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenSubject = new BehaviorSubject<string | undefined>(undefined);
  private idTokenSubject = new BehaviorSubject<string | undefined>(undefined);
  private refreshTokenSubject = new BehaviorSubject<string | undefined>(undefined);

  accessToken$: Observable<string | undefined> = this.accessTokenSubject.asObservable();
  idToken$: Observable<string | undefined> = this.idTokenSubject.asObservable();
  refreshToken$: Observable<string | undefined> = this.refreshTokenSubject.asObservable();

  constructor() {
    this.loadTokensFromStorage();
  }

  setAccessToken(token: string | undefined) {
    this.accessTokenSubject.next(token);
    this.saveTokenToStorage('NB_ACCESS_TOKEN', token);
  }

  setIdToken(token: string | undefined) {
    this.idTokenSubject.next(token);
    this.saveTokenToStorage('NB_ID_TOKEN', token);
  }

  setRefreshToken(token: string | undefined) {
    this.refreshTokenSubject.next(token);
    this.saveTokenToStorage('NB_REFRESH_TOKEN', token);
  }

  destroyTokens() {
    this.setAccessToken(undefined);
    this.setIdToken(undefined);
    this.setRefreshToken(undefined);
  }

  private loadTokensFromStorage() {
    this.setAccessToken(localStorage.getItem('NB_ACCESS_TOKEN') || undefined);
    this.setIdToken(localStorage.getItem('NB_ID_TOKEN') || undefined);
    this.setRefreshToken(localStorage.getItem('NB_REFRESH_TOKEN') || undefined);
  }

  private saveTokenToStorage(key: string, token: string | undefined) {
    if (token) {
      localStorage.setItem(key, token);
    } else {
      localStorage.removeItem(key);
    }
  }
}
