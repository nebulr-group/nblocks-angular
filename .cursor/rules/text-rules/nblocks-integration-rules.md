# nBlocks Integration Guidelines

These instructions are for large language models (LLMs) tasked with creating an SDK or integration for nBlocks in any language or framework. The integration should handle authentication, token management, feature flags, and team management. The output should be a developer-friendly, reusable package and an example application.

## 📌 Integration Goals

Create an SDK that supports:

- Redirecting to nBlocks login
- Handling the OAuth callback and exchanging authorization codes for tokens
- Storing and refreshing access tokens
- Evaluating feature flags (single and bulk)
- Launching the team management interface
- Wrapping the above into idiomatic, framework-specific constructs
- Creating a working example app to demonstrate SDK usage
- Make sure that the working example app and the sd- Make sure that the working example app and the sdk are in the same workspace but in separate projects.

## 🔐 Authentication

### 1. Redirect to Login

Redirect the user to:
```
https://auth.nblocks.cloud/url/login/{APP_ID}
```

**Requirements:**
- `{APP_ID}` must be provided by the developer via configuration
- Allow optional parameters like `redirect_uri` and `state`

### 2. OAuth Callback Handling

1. Handle the redirect from nBlocks at a route such as `/auth/oauth-callback`
2. Extract the authorization code from the request's query parameters
3. Exchange the code for tokens by making a POST request to:
   ```
   https://auth.nblocks.cloud/token/code/{APP_ID}
   ```
   Request body:
   ```json
   { "code": "AUTHORIZATION_CODE" }
   ```
4. Response will contain:
   - `access_token`
   - `refresh_token`
   - `id_token`
5. Verify tokens using public keys from:
   ```
   https://auth.nblocks.cloud/.well-known/jwks.json
   ```
6. Store tokens in secure local storage (or platform-appropriate equivalents)
7. Implement error handling for invalid, expired, or missing codes

## 🗝️ Token Management

### 3. Token Storage

Store the following tokens securely:
- `access_token`
- `refresh_token`
- `id_token`

**Storage Options:**
- Web: HTTP-only cookies or encrypted local storage
- Backend: encrypted in memory or persisted in session data

### 4. Token Renewal

1. **Automatic Renewal**
   - Monitor token expiration using expiry claim
   - Start renewal process before token expires (e.g., 5 minutes before)
   - Use refresh token to obtain new access token
   - Update stored tokens after successful renewal
   - Handle failed renewals gracefully

2. **Renewal Process**
   ```typescript
   interface TokenRenewalService {
     // Start monitoring token expiration
     startRenewalMonitoring(): void;
     
     // Force immediate token renewal
     renewTokens(): Promise<void>;
     
     // Handle failed renewals
     onRenewalFailure: Observable<Error>;
   }
   ```

3. **Best Practices**
   - Implement exponential backoff for failed renewals
   - Clear tokens and redirect to login on permanent failures
   - Handle concurrent renewal requests (prevent token race)
   - Retry failed API requests with new token
   - Log renewal failures for debugging

## 🗝️ Feature Flags

### Caching Strategy
- Cache all feature flags in memory using bulk loading
- Cache duration should be configurable (default: 5 minutes)
- Always use bulk loading to refresh stale cache
- Track last fetch time for cache invalidation

### Flag Evaluation Methods
1. **Cached Evaluation (Default)**
   - Use cached values from bulk load
   - Automatically refresh cache if stale
   - Preferred for most UI rendering scenarios

2. **Live Evaluation**
   - Only make individual flag requests when explicitly asked
   - Used for critical features requiring real-time status
   - Updates cache with the live value after check
   - Should be used sparingly to reduce API calls

### Implementation Requirements

**Service Layer**
```typescript
interface FeatureFlagService {
  // Bulk operations
  loadFeatureFlags(): Promise<void>;        // Loads all flags
  getFeatureFlags(): Observable<Flags>;     // Stream of all flags
  refreshFeatureFlags(): Promise<void>;     // Force cache refresh

  // Single flag operations
  isFeatureEnabled(flag: string, forceLive?: boolean): Promise<boolean>;
  getFeatureFlag(flag: string): Observable<boolean>;
}
```

**Directive Usage**
```typescript
// Cached (default)
<div *nblocksFeature="'feature-name'">
  Feature content
</div>

// Live check
<div *nblocksFeature="'feature-name'" [nblocksFeatureLive]="true">
  Feature content
</div>
```

**Component Usage**
```typescript
// Reactive approach with observables
someFlag$ = featureFlagService.getFeatureFlag('flag-name');

// Direct checks
const isEnabled = await featureFlagService.isFeatureEnabled('flag-name');
const isLiveEnabled = await featureFlagService.isFeatureEnabled('flag-name', true);
```

### Best Practices
1. Use bulk loading for initial and cache refresh operations
2. Prefer cached values for UI rendering
3. Use live checks only when real-time status is critical
4. Implement proper cleanup for observable subscriptions
5. Handle errors gracefully, falling back to cached values
6. Use reactive patterns with observables for UI updates

## 👥 Team Management

### 7. Open Team Management View

1. Display the team/user management interface using the @User Management Portal Docs
2. Authenticate using the access token
3. Embed or open in a new view as appropriate

## 🧱 SDK Design Requirements

### Platform-Specific Constructs

Create idiomatic constructs for each platform:
- Web: middleware, hooks, or services
- Backend: clients, context managers, or utilities

### API Interface

Expose a clear API with the following methods:
- `login()`
- `handleCallback(code)`
- `refreshToken()`
- `isFeatureEnabled(flagName)`
- `getTeamManagementUrl()`

### Configuration Options

Include the following configuration options:
- `appId`
- `callbackUrl`
- Custom token storage (pluggable)

## 🧑‍💻 Example Application

Create a minimal application using a default starter template that demonstrates:
- Redirect to login
- Handling the OAuth callback
- Displaying whether a user is logged in
- Fetching and using feature flags
- Launching the team management interface
- Refreshing tokens transparently

## 📦 Output Requirements

1. A reusable SDK/library, published to the correct package manager (npm, PyPI, Maven, etc.)
2. A working example app
3. Clear developer documentation and README

### Progressive Enhancement
- Allow applications to start with minimal nBlocks integration
- Support incremental adoption of features
- Make each nBlocks feature independently adoptable
- Provide fallback behavior when services are not available

### Navigation Patterns
- Always provide a way back to the main application
- Include clear visual indicators for nBlocks-specific features
- Use consistent navigation patterns across all nBlocks routes
- Example navigation structure:
  ```html
  <nav>
    <!-- Standard App Navigation -->
    <a href="/">Home</a>
    
    <!-- nBlocks Navigation -->
    <a href="/nblocks/dashboard">Dashboard</a>
    <a href="/nblocks/team">Team</a>
  </nav>
  ```

### Route Organization
- Keep the default framework experience intact (e.g., Angular's welcome page)
- Place all nBlocks functionality under a dedicated prefix (e.g., `/nblocks/`)
- Structure routes to clearly separate nBlocks features:
  ```typescript
  {
    path: 'nblocks',
    children: [
      { path: 'login', ... },
      { path: 'auth/callback', ... },
      { path: 'dashboard', ... },
      { path: 'team', ... }
    ]
  }
  ```

## 👤 Profile Management

### 8. Profile from ID Token

1. Extract user profile information from the ID token payload:
   ```typescript
   interface IDToken {
     sub: string;                 // User ID
     preferred_username: string;  // Username
     email: string;              // Email address
     email_verified: boolean;    // Email verification status
     name: string;              // Full name
     family_name: string;       // Family name
     given_name: string;        // Given name
     locale: string;            // User locale
     onboarded: boolean;        // User onboarding status
     multi_tenant: boolean;     // Multi-tenant access flag
     tenant_id?: string;        // Current tenant ID
     tenant_name?: string;      // Current tenant name
     tenant_locale?: string;    // Current tenant locale
     tenant_logo?: string;      // Current tenant logo URL
     tenant_onboarded?: boolean; // Current tenant onboarding status
   }
   ```

2. Transform ID token data into a user-friendly profile:
   ```typescript
   interface Profile {
     id: string;               // From sub claim
     username: string;         // From preferred_username
     email: string;
     emailVerified: boolean;
     fullName: string;
     familyName: string;
     givenName: string;
     locale: string;
     onboarded: boolean;
     multiTenantAccess: boolean;
     tenant?: {
       id: string;
       name: string;
       locale: string;
       logo: string;
       onboarded: boolean;
     };
   }
   ```

### Profile Service Requirements

**Service Layer**
```typescript
interface ProfileService {
  // Profile stream
  profile$: Observable<Profile | null>;  // Stream of current profile
  
  // Synchronous access
  getCurrentProfile(): Profile | null;   // Get current profile
  
  // Profile state
  isOnboarded(): Observable<boolean>;    // Stream of onboarding status
  hasMultiTenantAccess(): Observable<boolean>; // Stream of multi-tenant access
  
  // State management
  clearProfile(): void;                  // Clear current profile
}
```

### Implementation Requirements

1. **Token Verification**
   - Verify ID token using JWKS from well-known endpoint
   - Validate issuer and audience claims
   - Handle token expiration gracefully

2. **Profile Updates**
   - Update profile when ID token changes
   - Clear profile on logout
   - Handle verification errors appropriately

3. **Error Handling**
   - Handle invalid tokens
   - Handle expired tokens
   - Handle JWKS fetch failures
   - Provide appropriate error types:
     ```typescript
     class TokenExpiredError extends Error {}
     class InvalidTokenError extends Error {}
     class JwksError extends Error {}
     ```

### Best Practices
1. Use reactive patterns with observables for profile updates
2. Cache JWKS for performance
3. Implement proper cleanup for observable subscriptions
4. Handle all error cases gracefully
5. Provide type-safe access to profile data
6. Update profile state when tokens change

### UI Integration Example
```typescript
// Framework-agnostic interfaces
interface ProfileState {
  profile: Profile | null;
  isOnboarded: boolean;
  hasMultiTenantAccess: boolean;
}

// Example profile display (pseudo-template)
function ProfileDisplay({ profile }) {
  if (!profile) return null;
  
  return `
    <div class="profile-section">
      <span>Welcome, ${profile.username}</span>
      ${profile.tenant ? `
        <div class="tenant-info">
          <img src="${profile.tenant.logo}" alt="Tenant Logo">
          <span>${profile.tenant.name}</span>
        </div>
      ` : ''}
    </div>
  `;
}

// Generic component/controller usage
class ProfileController {
  constructor(profileService: ProfileService) {
    // Subscribe to profile changes
    profileService.profile$.subscribe(profile => {
      this.updateUI(profile);
    });
    
    // Access profile state
    const currentProfile = profileService.getCurrentProfile();
    
    // Check specific states
    profileService.isOnboarded().subscribe(onboarded => {
      this.handleOnboardingState(onboarded);
    });
    
    profileService.hasMultiTenantAccess().subscribe(hasAccess => {
      this.handleMultiTenantAccess(hasAccess);
    });
  }
  
  // Implementation specific methods
  private updateUI(profile: Profile | null) { /* ... */ }
  private handleOnboardingState(onboarded: boolean) { /* ... */ }
  private handleMultiTenantAccess(hasAccess: boolean) { /* ... */ }
}
```

## ��️ Route Protection

### 1. Authentication Guard

Create a route guard to protect authenticated routes:
```typescript
interface AuthGuard {
  // Return true if authenticated, false redirects to login
  canActivate(): Promise<boolean>;
}
```

**Implementation Requirements:**
1. Check token existence and validity
2. Redirect to login if not authenticated
3. Store original URL for post-login redirect
4. Handle token renewal if needed
5. Support both lazy and eager loaded routes

**Usage Example:**
```typescript
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [authGuard]
}
```

### 2. Feature Flag Guard

Create a guard for feature-flag protected routes:
```typescript
const createFeatureFlagGuard = (flagName: string) => {
  return async (): Promise<boolean> => {
    const isEnabled = await checkFeatureFlag(flagName);
    if (!isEnabled) {
      redirectToHome();
      return false;
    }
    return true;
  };
};
```

**Implementation Requirements:**
1. Accept feature flag name as parameter
2. Use live flag check (not cached)
3. Redirect to home/default route if disabled
4. Combine with auth guard when needed
5. Handle flag check failures gracefully

**Usage Example:**
```typescript
{
  path: 'beta-feature',
  component: BetaComponent,
  canActivate: [
    authGuard,
    featureFlagGuard('beta-feature')
  ]
}
```

### 3. Guard Composition

Guidelines for combining multiple guards:
- Authentication guard should run first
- Feature flag checks follow auth
- Guards run in sequence, not parallel
- All guards must pass for route access
- Consistent redirect behavior

**Example Structure:**
```typescript
{
  path: 'nblocks',
  children: [
    {
      path: 'auth',
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'callback', component: CallbackComponent }
      ]
    },
    {
      path: 'protected',
      canActivate: [authGuard],
      children: [
        { 
          path: 'beta',
          component: BetaComponent,
          canActivate: [featureFlagGuard('beta-feature')]
        },
        {
          path: 'team',
          component: TeamComponent
        }
      ]
    }
  ]
}
```

### Best Practices
1. Use type-safe guard implementations
2. Implement proper error handling
3. Provide clear user feedback on access denial
4. Cache guard results when appropriate
5. Clean up subscriptions and states
6. Log guard failures for debugging
7. Consider performance impact of guard checks