import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NblocksConfig } from '../../models/nblocks-config.interface';
import { AuthService } from '../../services/auth.service';
import { NBLOCKS_CONFIG } from '../../tokens/nblocks-tokens';

@Component({
  selector: 'nblocks-callback',
  template: '<div>Processing login...</div>',
  standalone: true
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig
  ) {}

  async ngOnInit() {
    try {
      const code = this.route.snapshot.queryParamMap.get('code');
      if (!code) {
        throw new Error('No authorization code received');
      }

      await this.authService.handleCallback(code);

      // Redirect to the configured success route
      await this.router.navigate([this.config.defaultRedirectRoute || '/']);
    } catch (error) {
      console.error('Authentication failed:', error);
      await this.router.navigate([this.config.loginRoute || '/login']);
    }
  }
} 
