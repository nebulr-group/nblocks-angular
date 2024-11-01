import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TeamComponent } from 'projects/nblocks/src/lib/components/team/team.component';
import { NavMenuComponent } from '../../shared/components/nav-menu.component';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, TeamComponent, NavMenuComponent],
  template: `
    <div class="page-container">
      <app-nav-menu></app-nav-menu>
      
      <div class="content">
        <div class="header">
          <h1>Team Management</h1>
          <p class="lead">Manage your team members and their roles.</p>
        </div>

        <div class="team-container">
          <nblocks-team></nblocks-team>
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

    .page-container {
      min-height: 100vh;
      background: #f8fafc; /* Slate 50 */
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .header {
      margin-bottom: 2rem;
    }

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

    .team-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0; /* Slate 200 */
      padding: 1.5rem;
    }
  `]
})
export class TeamPageComponent {} 