import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureFlagDirective } from 'projects/nblocks/src/lib/directives/feature-flag.directive';
import { AuthService } from 'projects/nblocks/src/lib/services/auth.service';
import { ProfileService } from 'projects/nblocks/src/lib/services/profile.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatureFlagDirective],
  template: `
    <nav class="menu">
      <ng-container *ngIf="auth.isAuthenticated$ | async as isAuthenticated; else loginButton">
        <span class="greeting" *ngIf="profile.profile$ | async as userProfile">
          Welcome back, {{ userProfile.username }}
        </span>          
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/nblocks/team" routerLinkActive="active">Team Management</a>
          <a routerLink="/protected" routerLinkActive="active">Protected Page</a>
          <ng-container *nblocksFeatureFlag="'beta-feature'">
            <a routerLink="/beta" class="beta-link" routerLinkActive="active">Beta Feature Available 🔥</a>
          </ng-container>
          <ng-container *nblocksFeatureFlag="'beta-feature'; negate: true">
            <span class="feature-disabled">Create a feature flag called "beta-feature" to enable this link 🚧</span>
          </ng-container>
          <button (click)="auth.logout()">Logout</button>
        </div>
      </ng-container>
      <ng-template #loginButton>
        <div class="nav-links">
          <a routerLink="/nblocks/auth/login">Login</a>
          <a routerLink="/protected">Protected Page</a>
        </div>
      </ng-template>
    </nav>
  `,
  styles: [`
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

    .menu a.active {
      background: #f8fafc;
      color: #0f172a;
      border-color: #94a3b8; /* Slate 400 */
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
      border-radius: 0.375rem;
      color: #666;
      font-style: italic;
    }
  `]
})
export class NavMenuComponent {
  constructor(
    public auth: AuthService,
    public profile: ProfileService
  ) {}
} 