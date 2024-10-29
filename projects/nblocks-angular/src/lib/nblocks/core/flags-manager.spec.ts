import { FlagsManager, FlagsManagerConfig, IFlagsClient } from './flags-manager';
import { BulkEvaluationResponse, FlagContext, UserContext } from '@nebulr-group/nblocks-ts-client';

describe('FlagsManager', () => {
  let flagsManager: FlagsManager;
  let config: FlagsManagerConfig;
  let mockFlagsClient: IFlagsClient;
  let bulkEvaluateSpy: jasmine.Spy;
  let mockResponse: BulkEvaluationResponse;
  let mockUserContext: UserContext;

  beforeEach(() => {
    mockResponse = {
      flags: [
        { flag: 'test-flag-1', evaluation: { enabled: true } },
        { flag: 'test-flag-2', evaluation: { enabled: false } }
      ]
    };

    mockUserContext = {
      id: 'test-user-id',
      email: 'test@example.com'
    };

    bulkEvaluateSpy = jasmine.createSpy('bulkEvaluate').and.returnValue(Promise.resolve(mockResponse));
    mockFlagsClient = {
      bulkEvaluate: bulkEvaluateSpy
    };

    config = {
      getFlagsClient: () => mockFlagsClient,
      onFlagsUpdated: jasmine.createSpy('onFlagsUpdated'),
      onLog: jasmine.createSpy('onLog'),
      onError: jasmine.createSpy('onError')
    };

    flagsManager = new FlagsManager(config);
  });

  it('should create an instance', () => {
    expect(flagsManager).toBeTruthy();
  });

  describe('setContext', () => {
    it('should update context and log the change', () => {
      const context: FlagContext = { user: mockUserContext };
      flagsManager.setContext(context);

      expect(config.onLog).toHaveBeenCalledWith('Flag context updated');
    });

    it('should handle undefined context', () => {
      flagsManager.setContext(undefined);

      expect(config.onLog).toHaveBeenCalledWith('Flag context updated');
    });
  });

  describe('flagEnabled', () => {
    it('should return false when flags storage is not initialized', () => {
      const result = flagsManager.flagEnabled('test-flag');

      expect(result).toBeFalse();
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag checked before storage initialization');
    });

    it('should return true for enabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-1');

      expect(result).toBeTrue();
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag-1 evaluated as true');
    });

    it('should return false for disabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-2');

      expect(result).toBeFalse();
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag-2 evaluated as false');
    });

    it('should return false for non-existent flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('non-existent-flag');

      expect(result).toBeFalse();
      expect(config.onLog).toHaveBeenCalledWith('Flag non-existent-flag evaluated as false');
    });
  });

  describe('evaluateFlags', () => {
    it('should skip evaluation when no access token is provided', async () => {
      await flagsManager.evaluateFlags(undefined);

      expect(bulkEvaluateSpy).not.toHaveBeenCalled();
      expect(config.onLog).toHaveBeenCalledWith('Evaluation skipped - No access token provided');
    });

    it('should evaluate flags successfully with access token', async () => {
      await flagsManager.evaluateFlags('test-token');

      expect(bulkEvaluateSpy).toHaveBeenCalledWith({
        accessToken: 'test-token',
        context: undefined
      });
      expect(config.onFlagsUpdated).toHaveBeenCalledWith(mockResponse);
      expect(config.onLog).toHaveBeenCalledWith('Starting flag evaluation');
      expect(config.onLog).toHaveBeenCalledWith('Flags evaluated successfully. Found 2 flags');
    });

    it('should evaluate flags with context when provided', async () => {
      const context: FlagContext = { user: mockUserContext };
      flagsManager.setContext(context);
      await flagsManager.evaluateFlags('test-token');

      expect(bulkEvaluateSpy).toHaveBeenCalledWith({
        accessToken: 'test-token',
        context
      });
    });

    it('should handle evaluation errors', async () => {
      const error = new Error('Test error');
      bulkEvaluateSpy.and.returnValue(Promise.reject(error));

      await flagsManager.evaluateFlags('test-token');

      expect(config.onError).toHaveBeenCalledWith(error);
      expect(config.onLog).toHaveBeenCalledWith('Error during flag evaluation');
    });
  });
}); 