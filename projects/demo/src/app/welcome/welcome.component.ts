import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureFlagDirective } from 'projects/nblocks/src/lib/directives/feature-flag.directive';
import { AuthService } from 'projects/nblocks/src/lib/services/auth.service';
import { FeatureFlagService } from 'projects/nblocks/src/lib/services/feature-flag.service';
import { ProfileService } from 'projects/nblocks/src/lib/services/profile.service';
import { TokenService } from 'projects/nblocks/src/lib/services/token.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { NavMenuComponent } from '../shared/components/nav-menu.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatureFlagDirective, NavMenuComponent],
  template: `
    <div class="container">
      <app-nav-menu></app-nav-menu>

      <div class="content">
        <div class="hero">
          <h1>Welcome to the nBlocks demo</h1>
        </div>

        <!-- Features Overview -->
        <div class="features-overview">
          <h2>The code demonstrates the following features</h2>
          <div class="features-grid">
            <div class="feature-group">
              <h3>🚦 Feature Flags</h3>
              <ul>
                <li>Basic feature flag usage</li>
                <li>Negation support for inverse conditions</li>
                <li>Cached vs live flag checks</li>
                <li>Route protection with flags</li>
              </ul>
            </div>

            <div class="feature-group">
              <h3>👥 Team Management</h3>
              <ul>
                <li>Team members overview</li>
                <li>Role management</li>
                <li>Invite system</li>
                <li>Permissions handling</li>
              </ul>
            </div>

            <div class="feature-group">
              <h3>🔐 Authentication</h3>
              <ul>
                <li>Login & logout flow</li>
                <li>Protected routes</li>
                <li>Automatic token renewal</li>
                <li>Profile information</li>
              </ul>
            </div>

            <div class="feature-group">
              <h3>🛠️ Integration Examples</h3>
              <ul>
                <li>Conditional rendering</li>
                <li>Route guards</li>
                <li>State management</li>
                <li>Error handling</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Status Cards -->
        <div class="status-grid" *ngIf="auth.isAuthenticated$ | async">
          <!-- Token Status Card -->
          <div class="status-card">
            <h3>Token Status</h3>
            <div class="card-content">
              <p>Token expires in: {{ tokenExpiresIn }}</p>
              <p>Last renewal: {{ lastRenewal || 'No renewals yet' }}</p>
              <p class="renewal-status" [class.renewing]="isRenewing">
                Status: {{ isRenewing ? 'Renewing token...' : 'Idle' }}
              </p>
            </div>
          </div>
          
          <!-- Cached Feature Flag Card -->
          <div class="status-card">
            <h3>Cached Feature Flag</h3>
            <div class="card-content">
              <p class="note">Uses cached values (5-minute cache)</p>
              <ng-container *nblocksFeatureFlag="'demo-flag'; else inactive">
                <div class="feature-status active">
                  <p>Feature flag "demo-flag" is active</p>
                </div>
              </ng-container>
              <ng-template #inactive>
                <div class="feature-status">
                  <p>Create a feature flag called "demo-flag"</p>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Live Feature Flag Card -->
          <div class="status-card">
            <h3>Live Feature Flag</h3>
            <div class="card-content">
              <p class="note">Direct API call on each load</p>
              <ng-container *nblocksFeatureFlag="'demo-flag'; live: true; else inactiveLive">
                <div class="feature-status active">
                  <p>Feature flag "demo-flag" is active</p>
                </div>
              </ng-container>
              <ng-template #inactiveLive>
                <div class="feature-status">
                  <p>Create a feature flag called "demo-flag"</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Import Inter font from Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Base styles */
    :host {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #0f172a; /* Slate 900 */
      line-height: 1.5;
    }

    .container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Typography */
    h1 {
      font-size: 2.25rem;
      font-weight: 600;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      color: #0f172a; /* Slate 900 */
    }

    .lead {
      font-size: 1.125rem;
      color: #475569; /* Slate 600 */
      margin-bottom: 2rem;
    }

    /* Navigation */
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0; /* Slate 200 */
      margin-bottom: 2rem;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .greeting {
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569; /* Slate 600 */
    }

    .menu a, .menu button {
      display: inline-flex;
      align-items: center;
      height: 2.25rem;
      padding: 0 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.375rem;
      transition: all 150ms ease;
      text-decoration: none;
      border: 1px solid #e2e8f0; /* Slate 200 */
      background: transparent;
      color: #475569; /* Slate 600 */
      cursor: pointer;
    }

    .menu a:hover, .menu button:hover {
      background: #f8fafc; /* Slate 50 */
      color: #0f172a; /* Slate 900 */
    }

    .menu button {
      background: #ef4444; /* Red 500 */
      color: white;
      border: none;
    }

    .menu button:hover {
      background: #dc2626; /* Red 600 */
      color: white;
    }

    /* Feature flag boxes - updated to match new design */
    .feature-flag-box {
      padding: 2rem;
      border-radius: 0.75rem;
      text-align: center;
      background: #fff;
      border: 1px solid #e2e8f0;
      color: #475569;
      transition: all 150ms ease;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }

    .feature-flag-box.active {
      background: #f0fdf4; /* Green 50 */
      border-color: #86efac; /* Green 300 */
      color: #166534; /* Green 800 */
    }

    .feature-flag-box p {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Token status section */
    .token-status-section {
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin: 2rem auto;
      max-width: 800px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }

    .token-status-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 1rem 0;
    }

    .token-info {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
    }

    .token-info p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #475569;
    }

    .renewal-status {
      font-weight: 500;
    }

    .renewal-status.renewing {
      color: #2563eb; /* Blue 600 */
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    .feature-flags-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .feature-flag-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      margin: 0;
      color: #495057;
    }

    .explanation {
      text-align: left;
      background: #fff;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border: 1px solid #e9ecef;
    }

    .explanation p {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .explanation ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      color: #6c757d;
    }

    .explanation li {
      margin: 0.25rem 0;
    }

    .note {
      font-style: italic;
      color: #6c757d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .refresh-button {
      padding: 6px 12px;
      background: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .refresh-button:hover {
      background: #dee2e6;
    }

    .last-update {
      font-size: 0.9rem;
      color: #6c757d;
      margin: 0.5rem 0 0 0;
      font-style: italic;
    }

    .beta-link {
      background: linear-gradient(135deg, #ff9800, #f57c00) !important;
      color: white !important;
      font-weight: 500;
    }
    .beta-link:hover {
      background: linear-gradient(135deg, #f57c00, #e65100) !important;
    }

    .feature-disabled {
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px dashed #999;
      border-radius: 4px;
      color: #666;
      font-style: italic;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .status-card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      overflow: hidden;
    }

    .status-card h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
      padding: 1rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-content {
      padding: 1rem;
    }

    .card-content p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #475569;
    }

    .note {
      font-size: 0.75rem !important;
      color: #64748b !important;
      font-style: italic;
      margin-bottom: 1rem !important;
    }

    .feature-status {
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: #fff7ed;
      border: 1px solid #fdba74;
    }

    .feature-status.active {
      background: #f0fdf4;
      border-color: #86efac;
    }

    .feature-status p {
      margin: 0 !important;
      color: #9a3412;
    }

    .feature-status.active p {
      color: #166534;
    }

    .renewal-status {
      font-weight: 500;
    }

    .renewal-status.renewing {
      color: #2563eb;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    @media (min-width: 1024px) {
      .status-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .hero {
      text-align: center;
      margin-bottom: 4rem;
    }

    .features-overview {
      margin-bottom: 3rem;
    }

    .features-overview h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2rem;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 0 auto;
      max-width: 1200px;
    }

    .feature-group {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      padding: 1.5rem;
      transition: all 150ms ease;
    }

    .feature-group:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    .feature-group h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .feature-group ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-group li {
      font-size: 0.875rem;
      color: #475569;
      padding: 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .feature-group li::before {
      content: "→";
      color: #2563eb;
      font-weight: 500;
    }

    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 768px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  title = 'demo';
  lastCacheUpdate = 'Not yet updated';
  tokenExpiresIn = 'Checking...';
  lastRenewal: string | null = null;
  isRenewing = false;
  private destroy$ = new Subject<void>();
  private tokenExpiryInterval: any;

  constructor(
    public auth: AuthService,
    public profile: ProfileService,
    private tokenService: TokenService,
    private featureFlagService: FeatureFlagService,
    private cdr: ChangeDetectorRef
  ) {
    this.updateTimestamp();
  }

  ngOnInit() {
    // Monitor token changes
    this.tokenService.accessToken$().pipe(
      takeUntil(this.destroy$)
    ).subscribe(token => {
      if (token) {
        this.lastRenewal = new Date().toLocaleTimeString();
        this.isRenewing = false;
        this.updateTokenExpiry(); // Update expiry immediately when token changes
      } else {
        this.tokenExpiresIn = 'No token';
      }
      this.cdr.detectChanges();
    });

    // Update token expiry time
    this.updateTokenExpiry();
    this.tokenExpiryInterval = setInterval(() => this.updateTokenExpiry(), 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.tokenExpiryInterval) {
      clearInterval(this.tokenExpiryInterval);
    }
  }

  private async updateTokenExpiry() {
    try {
      const token = await firstValueFrom(this.tokenService.accessToken$());
      if (token) {
        // Decode the JWT to get expiry
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = payload.exp - now;
            
            if (timeLeft > 0) {
              const minutes = Math.floor(timeLeft / 60);
              const seconds = timeLeft % 60;
              this.tokenExpiresIn = `${minutes}m ${seconds}s`;
              
              // Show renewing status when close to expiry (e.g., last 5 minutes)
              this.isRenewing = timeLeft < 300;
            } else {
              this.tokenExpiresIn = 'Expired';
              this.isRenewing = false;
            }
          } else {
            this.tokenExpiresIn = 'No expiry found';
          }
        } else {
          this.tokenExpiresIn = 'Invalid token format';
        }
      } else {
        this.tokenExpiresIn = 'No token';
        this.isRenewing = false;
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
      this.tokenExpiresIn = 'Error checking expiry';
      this.isRenewing = false;
    }
    this.cdr.detectChanges();
  }

  async refreshFlags() {
    await this.featureFlagService.refreshFeatureFlags();
    this.updateTimestamp();
    this.cdr.detectChanges();
  }

  private updateTimestamp() {
    this.lastCacheUpdate = new Date().toLocaleTimeString();
  }
} 