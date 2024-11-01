import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-beta-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="beta-container">
      <div class="feature-content">
        <h1>Beta Feature Page</h1>
        <p>🎉 Welcome to the beta feature! This page is protected by:</p>
        <ul>
          <li>Authentication guard - ensures you're logged in</li>
          <li>Feature flag guard - ensures "beta-feature" is enabled</li>
        </ul>
        <p class="note">If either guard fails, you won't be able to access this page at all!</p>
      </div>
    </div>
  `,
  styles: [`
    .beta-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .feature-content {
      padding: 2rem;
      border-radius: 8px;
      background: #f8f9fa;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid #4caf50;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }
    p {
      color: #34495e;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    ul {
      list-style-position: inside;
      text-align: left;
      max-width: 400px;
      margin: 1rem auto;
    }
    li {
      color: #34495e;
      line-height: 1.8;
    }
    .note {
      font-style: italic;
      color: #666;
      margin-top: 1.5rem;
    }
  `]
})
export class BetaFeatureComponent {} 