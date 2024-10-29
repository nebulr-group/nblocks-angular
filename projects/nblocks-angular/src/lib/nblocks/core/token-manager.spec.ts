import { TokenManager, TokenExpirationConfig } from './token-manager';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  let mockStorage: Storage;
  let mockExpirationConfig: TokenExpirationConfig;

  beforeEach(() => {
    mockStorage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
      length: 0,
      key: jasmine.createSpy('key')
    };

    mockExpirationConfig = {
      getTokenExpiration: jasmine.createSpy('getTokenExpiration')
    };

    tokenManager = new TokenManager(mockStorage, mockExpirationConfig);
  });

  it('should load tokens from storage on initialization', () => {
    expect(mockStorage.getItem).toHaveBeenCalledWith('NB_ACCESS_TOKEN');
    expect(mockStorage.getItem).toHaveBeenCalledWith('NB_ID_TOKEN');
    expect(mockStorage.getItem).toHaveBeenCalledWith('NB_REFRESH_TOKEN');
  });

  it('should set and save token to storage', () => {
    const token = 'test-token';
    tokenManager.setToken('access', token);

    expect(mockStorage.setItem).toHaveBeenCalledWith('NB_ACCESS_TOKEN', token);
  });

  it('should remove token from storage when set to undefined', () => {
    tokenManager.setToken('access', undefined);

    expect(mockStorage.removeItem).toHaveBeenCalledWith('NB_ACCESS_TOKEN');
  });

  it('should notify listeners when token changes', () => {
    const listener = jasmine.createSpy('listener');
    const token = 'test-token';

    tokenManager.subscribe('access', listener);
    tokenManager.setToken('access', token);

    expect(listener).toHaveBeenCalledWith(token);
  });

  it('should destroy all tokens', () => {
    tokenManager.destroyTokens();

    expect(mockStorage.removeItem).toHaveBeenCalledWith('NB_ACCESS_TOKEN');
    expect(mockStorage.removeItem).toHaveBeenCalledWith('NB_ID_TOKEN');
    expect(mockStorage.removeItem).toHaveBeenCalledWith('NB_REFRESH_TOKEN');
  });

  it('should clear expired tokens', () => {
    const now = new Date().getTime();
    const expiredToken = 'expired-token';
    const validToken = 'valid-token';

    // Reset any previous calls
    (mockStorage.removeItem as jasmine.Spy).calls.reset();

    // Set up the expiration check to properly identify tokens
    (mockExpirationConfig.getTokenExpiration as jasmine.Spy).and.callFake((token: string) => {
        if (token === expiredToken) {
            return (now - 1000) / 1000; // expired (1 second ago)
        }
        if (token === validToken) {
            return (now + 3600000) / 1000; // valid (1 hour in future)
        }
        return 0;
    });

    // Set tokens first
    tokenManager.setToken('refresh', validToken);
    tokenManager.setToken('access', expiredToken);
    
    // Reset storage calls after setting tokens
    (mockStorage.removeItem as jasmine.Spy).calls.reset();
    
    // Now check expiration
    tokenManager.clearExpiredTokens();

    expect(mockStorage.removeItem).toHaveBeenCalledWith('NB_ACCESS_TOKEN');
    expect(mockStorage.removeItem).not.toHaveBeenCalledWith('NB_REFRESH_TOKEN');
  });
}); 