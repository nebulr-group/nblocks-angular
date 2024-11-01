import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="protected-container">
      <h1>Protected Page</h1>
      <p>If you can see this, you are successfully authenticated! 🔒</p>
      <p>This page is protected by the nBlocks authentication guard.</p>
    </div>
  `,
  styles: [`
    .protected-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    p {
      color: #34495e;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  `]
})
export class ProtectedPageComponent {} 