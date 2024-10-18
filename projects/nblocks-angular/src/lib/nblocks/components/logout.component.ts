import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { NblocksClientService } from '../services/nblocks-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '<p>Logging out...</p>'
})
export class LogoutComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tokenService.destroyTokens();
    const nblocksClient = this.nblocksClientService.getNblocksClient();
    const logoutUrl = nblocksClient.auth.getLogoutUrl();
    
    // Perform the redirect
    if (logoutUrl) {
      window.location.href = logoutUrl;
    } else {
      // If for some reason logoutUrl is not available, redirect to home
      this.router.navigate(['/']);
    }
  }
}
