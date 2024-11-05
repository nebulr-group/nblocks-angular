import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { NblocksClientService } from './nblocks-client.service';
import { LoginManager } from '@nebulr-group/nblocks-ts-client/engine';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginManager: LoginManager;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private logService: LogService   
  ) {
    const nblocksClient = this.nblocksClientService.getNblocksClient();

    this.loginManager = new LoginManager({
      getLoginUrl: () => nblocksClient.auth.getLoginUrl(),
      onError: () => this.router.navigate(['/error']),
      clearTokens: () => this.tokenService.destroyTokens(),
      logger: this.logService,
      redirect: (url: string) => {              
        window.location.href = url;        
      },
    });
  }

  redirectToLogin() {
    this.loginManager.redirectToLogin();
  }
}
