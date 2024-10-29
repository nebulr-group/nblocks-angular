import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { NblocksConfigService } from './nblocks-config.service';
import { NblocksConfig } from '../models/nblocks-config.model';

describe('LogService', () => {
  let service: LogService;
  let mockConfigService: jasmine.SpyObj<NblocksConfigService>;

  const mockConfig: NblocksConfig = {
    appId: 'test-app',
    handoverPath: '/',
    debug: true,
    stage: 'PROD' as const,
    disableRedirects: false
  };

  beforeEach(() => {
    // Create mock for NblocksConfigService
    mockConfigService = jasmine.createSpyObj('NblocksConfigService', ['getConfig']);
    mockConfigService.getConfig.and.returnValue(mockConfig);

    TestBed.configureTestingModule({
      providers: [
        LogService,
        { provide: NblocksConfigService, useValue: mockConfigService }
      ]
    });

    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get config from NblocksConfigService during initialization', () => {
    expect(mockConfigService.getConfig).toHaveBeenCalled();
  });
}); 