import { TokenRefresher, TokenRefresherConfig } from './token-refresher';

describe('TokenRefresher', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

  let tokenRefresher: TokenRefresher;
  let config: TokenRefresherConfig;
  let mockTokens: { access_token: string; refresh_token: string; expires_in: number };

  beforeEach(() => {
    jasmine.clock().install();

    mockTokens = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      expires_in: 3600
    };

    config = {
      isRestrictedPath: jasmine.createSpy('isRestrictedPath'),
      getTokenExpiration: jasmine.createSpy('getTokenExpiration'),
      refreshTokens: jasmine.createSpy('refreshTokens'),
      onLog: jasmine.createSpy('onLog'),
      onError: jasmine.createSpy('onError')
    };

    (config.isRestrictedPath as jasmine.Spy).and.returnValue(false);
    (config.getTokenExpiration as jasmine.Spy).and.returnValue(3600);
    (config.refreshTokens as jasmine.Spy).and.returnValue(Promise.resolve(mockTokens));

    tokenRefresher = new TokenRefresher(config);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should start refresh cycle when valid refresh token is provided', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    await Promise.resolve();
    jasmine.clock().tick(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledWith('test-refresh-token');
  });

  it('should not start refresh cycle when in restricted path', () => {
    (config.isRestrictedPath as jasmine.Spy).and.returnValue(true);
    tokenRefresher.startRefreshCycle('test-refresh-token');

    expect(config.refreshTokens).not.toHaveBeenCalled();
  });

  it('should schedule next refresh after successful token refresh', async () => {
    // Start the refresh cycle
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    await Promise.resolve();
    jasmine.clock().tick(0); // Process any immediate timers
    await Promise.resolve();

    // Clear first set of calls
    (config.refreshTokens as jasmine.Spy).calls.reset();
    
    // Advance clock to trigger next refresh (90% of expires_in)
    jasmine.clock().tick(3240 * 1000);
    await Promise.resolve();
    jasmine.clock().tick(0); // Process any immediate timers
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should retry on error with retry interval', async () => {
    (config.refreshTokens as jasmine.Spy).and.returnValue(Promise.reject('Test error'));
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first failed refresh attempt
    await Promise.resolve();
    jasmine.clock().tick(0);
    await Promise.resolve();

    expect(config.onError).toHaveBeenCalled();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jasmine.Spy).calls.reset();
    
    // Advance to retry
    jasmine.clock().tick(60 * 1000);
    await Promise.resolve();
    jasmine.clock().tick(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should stop refresh cycle', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    await Promise.resolve();
    jasmine.clock().tick(0);
    await Promise.resolve();

    tokenRefresher.stopRefreshCycle();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jasmine.Spy).calls.reset();
    
    // Advance clock and verify no more refreshes
    jasmine.clock().tick(3600 * 1000);
    await Promise.resolve();
    jasmine.clock().tick(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(0);
  });
}); 