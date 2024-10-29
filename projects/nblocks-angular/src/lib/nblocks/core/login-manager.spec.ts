import { LoginManager, LoginManagerConfig } from './login-manager';

describe('LoginManager', () => {
  let loginManager: LoginManager;
  let config: LoginManagerConfig;
  let locationRef: { href: string };

  beforeEach(() => {
    locationRef = { href: '' };
    
    // Create spies for the config
    config = {
      getLoginUrl: jasmine.createSpy('getLoginUrl').and.returnValue('https://login.example.com'),
      onError: jasmine.createSpy('onError'),
      clearTokens: jasmine.createSpy('clearTokens'),
      locationRef
    };

    // Create the login manager
    loginManager = new LoginManager(config);
  });

  it('should clear tokens and redirect to login URL', () => {
    loginManager.redirectToLogin();

    expect(config.clearTokens).toHaveBeenCalled();
    expect(locationRef.href).toBe('https://login.example.com');
  });

  it('should handle error when login URL is undefined', () => {
    (config.getLoginUrl as jasmine.Spy).and.returnValue(undefined);
    const consoleErrorSpy = spyOn(console, 'error');
    
    loginManager.redirectToLogin();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get login URL');
    expect(config.onError).toHaveBeenCalled();
  });
}); 