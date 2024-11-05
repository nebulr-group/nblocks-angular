import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlagsService } from '../flags.service';
import { NblocksClientService } from '../nblocks-client.service';
import { TokenService } from '../token.service';
import { LogService } from '../log.service';
import { of, BehaviorSubject } from 'rxjs';
import { BulkEvaluationResponse, FlagContext, NblocksPublicClient } from '@nebulr-group/nblocks-ts-client/core-api';
import { NblocksConfigService } from '../nblocks-config.service';


(window as any).process = {
    env: {
      NODE_ENV: 'test'
    }
  };
  

describe('FlagsService Integration Test', () => {
  let service: FlagsService;
  let nblocksClientService: NblocksClientService;
  let tokenService: TokenService;
  let logService: LogService;
  let configService: NblocksConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FlagsService, 
        NblocksClientService, 
        TokenService, 
        LogService,
        NblocksConfigService
      ],
    });

    configService = TestBed.inject(NblocksConfigService);
    configService.setConfig({
        appId: '671279b938f34e0008b4343ved2',      
    });
  
    service = TestBed.inject(FlagsService);
    nblocksClientService = TestBed.inject(NblocksClientService);
    tokenService = TestBed.inject(TokenService);
    logService = TestBed.inject(LogService);
  });

  it('should initialize flag storage and evaluate flags', (done) => {
    const mockResponse: BulkEvaluationResponse = {
      flags: [{ flag: 'testFlag', evaluation: { enabled: true } }],
    };
    const mockClient = {
      flag: {
        bulkEvaluate: () => Promise.resolve(mockResponse),
      },
    } as unknown as NblocksPublicClient;

    spyOn(nblocksClientService, 'getNblocksClient').and.returnValue(mockClient);
    tokenService.accessToken$ = new BehaviorSubject<string | undefined>('test-token');

    service.initializeFlagStorage().subscribe(() => {
      expect(service.flagEnabled('testFlag')).toBeTrue();
      done();
    });
  });

  //FIXME flags should acttually be available when no accessToken is available
  it('should log error if accessToken is not available', (done) => {
    const mockResponse: BulkEvaluationResponse = {
        flags: [{ flag: 'testFlag', evaluation: { enabled: true } }],
      };
      const mockClient = {
        flag: {
          bulkEvaluate: () => Promise.resolve(mockResponse),
        },
      } as unknown as NblocksPublicClient;
    

    spyOn(nblocksClientService, 'getNblocksClient').and.returnValue(mockClient);
    tokenService.accessToken$ = new BehaviorSubject<string | undefined>('test-token');
    spyOn(logService, 'log');

    service.initializeFlagStorage().subscribe(
      () => {},
      () => {},
      () => {
        expect(logService.log).toHaveBeenCalledWith('No accessToken');
        done();
      }
    );
  });

  it('should update context and re-evaluate flags', (done) => {
    const context: FlagContext = { user: { id: 'test-user' } };
    const mockResponse: BulkEvaluationResponse = {
      flags: [{ flag: 'testFlag', evaluation: { enabled: true } }],
    };
    const mockClient = {
      flag: {
        bulkEvaluate: () => Promise.resolve(mockResponse),
      },
    } as unknown as NblocksPublicClient;

    spyOn(nblocksClientService, 'getNblocksClient').and.returnValue(mockClient);
    tokenService.accessToken$ = new BehaviorSubject<string | undefined>('test-token');

    service.setContext(context);

    service.initializeFlagStorage().subscribe(() => {
      expect(service.flagEnabled('testFlag')).toBeTrue();
      done();
    });
  });
});
