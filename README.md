# nBlocks Angular Demo & Library Documentation

This repository contains both the nBlocks Angular library and a demo application showcasing its features.

## Table of Contents

### Demo Application
- [Feature Examples](#feature-examples)
  - [Feature Flags](#feature-flags)
  - [Team Management](#team-management)
  - [Authentication](#authentication)
  - [Integration Patterns](#integration-patterns)
- [Getting Started](#getting-started)
- [Key Files](#key-files)
- [Testing Features](#testing-features)
- [Tips](#tips)

### Library Documentation
- [nBlocks Library Components](#nblocks-library-components)
  - [Authentication Components](#authentication-components)
  - [Team Management](#team-management-1)
  - [Feature Flag Directive](#feature-flag-directive)
  - [Core Services](#core-services)
    - [Authentication](#authentication-1)
    - [Feature Management](#feature-management)
    - [Team Operations](#team-operations)
  - [Guards](#guards)
  - [Configuration](#configuration)
  - [Dependency Injection Tokens](#dependency-injection-tokens)
  - [HTTP Interceptor](#http-interceptor)

---

# Demo Application Documentation

## Feature Examples

### Feature Flags
Learn how to implement feature flags in your Angular application:

- **Basic Usage**: Check `welcome.component.ts` for examples of:
  ```typescript
  // Basic feature flag check
  *nblocksFeatureFlag="'feature-name'"
  
  // With negation
  *nblocksFeatureFlag="'feature-name'; negate: true"
  
  // Live check (bypassing cache)
  *nblocksFeatureFlag="'feature-name'; live: true"
  ```

- **Route Protection**: See `app.routes.ts` for an example of protecting routes with feature flags
- **Caching Behavior**: The welcome page demonstrates both cached and live feature flag checks

### Team Management
Explore team management functionality:

- **Team Component**: Navigate to `/nblocks/team` or check `pages/team/team.page.ts`
- **Role Management**: Team component includes examples of:
  - Viewing team members
  - Managing roles
  - Handling invites
  - Permission checks

### Authentication
Authentication examples are spread across several files:

- **Login/Logout**: 
  - Login implementation: `nblocks/auth/login`
  - Logout: See `nav-menu.component.ts`

- **Token Handling**: 
  - Auto-renewal: Check `services/token.service.ts`
  - Status monitoring: See token status display in `welcome.component.ts`

- **Protected Routes**: 
  - Route guard implementation: `guards/protected-route.guard.ts`
  - Usage example: `app.routes.ts`

### Integration Patterns

- **Conditional Rendering**:
  ```typescript
  // Example in welcome.component.ts
  *ngIf="auth.isAuthenticated$ | async"
  ```

- **Profile Information**:
  ```typescript
  // Example in nav-menu.component.ts
  *ngIf="profile.profile$ | async as userProfile"
  ```

- **State Management**:
  - Auth state: `services/auth.service.ts`
  - Profile state: `services/profile.service.ts`
  - Token state: `services/token.service.ts`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your nBlocks app ID in `environment.ts`
4. Run the demo: `ng serve`

## Key Files

- `welcome.component.ts` - Main demo page with multiple feature examples
- `nav-menu.component.ts` - Navigation and auth state handling
- `services/` - Core services for auth, tokens, and feature flags
- `guards/` - Route protection implementations
- `pages/` - Feature-specific page components

## Testing Features

1. **Feature Flags**:
   - Create a flag called "beta-feature" in your nBlocks dashboard
   - Toggle it to see changes in the UI
   - Notice the difference between cached and live checks

2. **Authentication**:
   - Try accessing protected routes while logged out
   - Observe token auto-renewal behavior
   - Check token status display

3. **Team Management**:
   - Add team members
   - Modify roles
   - Test permission-based UI updates

## Tips

- Watch the browser console for token renewal logs
- Use the token status display to understand token lifecycle
- Try both cached and live feature flag checks to understand the difference
- Experiment with feature flag negation for inverse conditions

## Contributing

Feel free to submit issues and enhancement requests!

---

# Library Documentation

## nBlocks Library Components

The `@nblocks/angular` library (located in `projects/nblocks/`) provides a set of components and services for integrating nBlocks features into your Angular application.

### Authentication Components
- `<nblocks-login>` - Pre-built login component with OAuth2 flow
  ```typescript
  <nblocks-login></nblocks-login>
  ```
- `<nblocks-callback>` - OAuth callback handler component
  ```typescript
  // In your routes configuration
  {
    path: 'callback',
    component: CallbackComponent
  }
  ```

### Team Management
- `<nblocks-team>` - Team management component
  ```typescript
  <nblocks-team></nblocks-team>
  ```

### 🚦 Feature Flag Directive
- `*nblocksFeatureFlag` - Structural directive for feature-gated content
  ```typescript
  <!-- Basic usage -->
  <div *nblocksFeatureFlag="'premium-feature'">
    Premium content here
  </div>

  <!-- With negation (show when feature is disabled) -->
  <div *nblocksFeatureFlag="'premium-feature'; negate: true">
    Feature is disabled
  </div>

  <!-- With else template -->
  <div *nblocksFeatureFlag="'premium-feature'; else notEnabled">
    Feature is enabled
  </div>
  <ng-template #notEnabled>
    Feature is not enabled
  </ng-template>

  <!-- Combined: live check with else template -->
  <div *nblocksFeatureFlag="'premium-feature'; live: true; else notEnabled">
    Feature is enabled (checked in real-time)
  </div>
  <ng-template #notEnabled>
    Feature is not enabled
  </ng-template>

  <!-- All options combined -->
  <div *nblocksFeatureFlag="'premium-feature'; 
       negate: true; 
       live: true;
       else notEnabled">
    Feature is disabled (checked in real-time)
  </div>
  <ng-template #notEnabled>
    Feature is enabled
  </ng-template>
  ```

### Core Services

#### Authentication
- `AuthService` - Handles authentication state and operations
  ```typescript
  constructor(private auth: AuthService) {
    auth.isAuthenticated$.subscribe(isAuth => {
      // Handle auth state changes
    });
  }
  ```
- `TokenService` - Manages access tokens and auto-renewal
- `ProfileService` - User profile management and updates

#### Feature Management
- `FeatureFlagService` - Feature flag evaluation and caching
  ```typescript
  constructor(private featureFlags: FeatureFlagService) {
    featureFlags.isFeatureEnabled('feature-name').subscribe(enabled => {
      // Handle feature state
    });
  }
  ```

#### Team Operations
- `TeamService` - Team management operations
  ```typescript
  constructor(private team: TeamService) {
    team.getMembers().subscribe(members => {
      // Handle team members
    });
  }
  ```

### Guards
- `ProtectedRouteGuard` - Route protection based on authentication

### 🔧 Configuration

To integrate nBlocks into your Angular application, follow these steps:

1. **Install the Package**
   ```bash
   npm install @nblocks/angular
   ```

2. **Configure Environment**
   Create or update your environment files (`environment.ts` and `environment.prod.ts`):
   ```typescript
   export const environment = {
     production: false,
     nblocks: {
       appId: 'your-app-id',
       baseUrl: 'https://api.nblocks.cloud' // Optional: defaults to production
     }
   };
   ```

3. **Import the Module**
   In your `app.module.ts`:
   ```typescript
   import { NblocksModule } from '@nblocks/angular';
   import { environment } from '../environments/environment';

   @NgModule({
     imports: [
       // ... other imports
       NblocksModule.forRoot({
         appId: environment.nblocks.appId,
         baseUrl: environment.nblocks.baseUrl // Optional
       })
     ]
   })
   export class AppModule { }
   ```

4. **Configure Routes**
   Set up the authentication callback route in your `app-routing.module.ts`:
   ```typescript
   import { CallbackComponent } from '@nblocks/angular';

   const routes: Routes = [
     // ... your other routes
     {
       path: 'callback',
       component: CallbackComponent
     }
   ];
   ```

5. **Add Protected Routes** (Optional)
   To protect routes that require authentication:
   ```typescript
   import { ProtectedRouteGuard } from '@nblocks/angular';

   const routes: Routes = [
     {
       path: 'protected',
       component: ProtectedComponent,
       canActivate: [ProtectedRouteGuard]
     }
   ];
   ```

6. **Configure HTTP Interceptor** (Optional)
   The HTTP interceptor is automatically configured when you import `NblocksModule`. It will:
   - Add authentication tokens to requests
   - Handle token renewal
   - Manage authenticated API calls

#### Configuration Options

The `NblocksModule.forRoot()` method accepts the following options:

```typescript
interface NblocksConfig {
  // Required: Your nBlocks application ID
  appId: string;
  
  // Optional: API base URL, defaults to production
  baseUrl?: string;
  
  // Optional: Authentication configuration
  auth?: {
    // Optional: URL to redirect after successful login
    redirectUrl?: string;
    
    // Optional: Enable automatic token renewal (default: true)
    silentRenewal?: boolean;
  };
}
```

### 💉 Dependency Injection Tokens
- `