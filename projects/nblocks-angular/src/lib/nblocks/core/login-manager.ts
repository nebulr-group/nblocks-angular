export interface LoginManagerConfig {
  getLoginUrl: () => string | undefined;
  onError?: () => void;
  clearTokens: () => void;
  locationRef?: { href: string };
}

export class LoginManager {
  private config: LoginManagerConfig;
  private locationRef: { href: string };

  constructor(config: LoginManagerConfig) {
    this.config = config;
    this.locationRef = config.locationRef || window.location;
  }

  redirectToLogin(): void {
    this.config.clearTokens();
    const loginUrl = this.config.getLoginUrl();
    
    if (loginUrl) {
      this.locationRef.href = loginUrl;
    } else {
      console.error('Failed to get login URL');
      this.config.onError?.();
    }
  }
} 