import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { NblocksClientService } from './nblocks-client.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService
  ) {}

  redirectToLogin() {
    this.tokenService.destroyTokens();
    const nblocksClient = this.nblocksClientService.getNblocksClient();
    const loginUrl = nblocksClient.auth.getLoginUrl();
    
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      console.error('Failed to get login URL');
      this.router.navigate(['/error']);
    }
  }
}
