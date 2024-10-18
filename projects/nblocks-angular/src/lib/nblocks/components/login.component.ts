import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { NblocksClientService } from '../services/nblocks-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: '<p>Redirecting to login...</p>'
})
export class LoginComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tokenService.destroyTokens();
    const nblocksClient = this.nblocksClientService.getNblocksClient();
    const loginUrl = nblocksClient.auth.getLoginUrl();
    
    // Perform the redirect
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      // If for some reason loginUrl is not available, redirect to home
      this.router.navigate(['/']);
    }
  }
}
