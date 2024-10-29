import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { NblocksClientService } from './nblocks-client.service';
import { LoginManager } from '../core/login-manager';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginManager: LoginManager;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService
  ) {
    const nblocksClient = this.nblocksClientService.getNblocksClient();

    this.loginManager = new LoginManager({
      getLoginUrl: () => nblocksClient.auth.getLoginUrl(),
      onError: () => this.router.navigate(['/error']),
      clearTokens: () => this.tokenService.destroyTokens()
    });
  }

  redirectToLogin() {
    this.loginManager.redirectToLogin();
  }
}
