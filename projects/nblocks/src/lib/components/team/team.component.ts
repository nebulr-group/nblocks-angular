import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TeamManagementService } from '../../services/team-management.service';

@Component({
  selector: 'nblocks-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="error; else loadingOrTeam">
      <div class="error-container">
        <h2>Error</h2>
        <p>{{ error }}</p>
      </div>
    </ng-container>
    <ng-template #loadingOrTeam>
      <ng-container *ngIf="!teamManagementUrl">
        <div class="loading-container">
          <p>Loading team management...</p>
        </div>
      </ng-container>
      <ng-container *ngIf="teamManagementUrl">
        <iframe
          [src]="teamManagementUrl"
          title="Team Management"
        ></iframe>
      </ng-container>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    iframe {
      width: 100%;
      min-height: 100vh;
      height: 100%;
      border: none;
      display: block;
    }
    .error-container {
      padding: 20px;
      text-align: center;
      color: #721c24;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin: 20px;
    }
    .loading-container {
      padding: 20px;
      text-align: center;
      color: #004085;
      background-color: #cce5ff;
      border: 1px solid #b8daff;
      border-radius: 4px;
      margin: 20px;
    }
  `]
})
export class TeamComponent implements OnInit {
  teamManagementUrl: SafeResourceUrl | null = null;
  error: string | null = null;

  constructor(
    private teamManagementService: TeamManagementService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    try {
      const url = await this.teamManagementService.getTeamManagementUrl();
      this.teamManagementUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Failed to load team management';
      console.error('Team management error:', e);
    }
  }
} 