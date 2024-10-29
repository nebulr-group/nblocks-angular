import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProtectedRouteGuard } from '../protected-route.guard';
import { NblocksClientService } from '../../services/nblocks-client.service';
import { TokenService } from '../../services/token.service';
import { LogService } from '../../services/log.service';
import { LoginService } from '../../services/login.service';

describe('ProtectedRouteGuard (Integration)', () => {
  let guard: ProtectedRouteGuard;
  let nblocksClientService: jasmine.SpyObj<NblocksClientService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let logService: jasmine.SpyObj<LogService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let mockNblocksClient: any;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockNblocksClient = {
      auth: {
        contextHelper: {
          getAuthContextVerified: jasmine.createSpy('getAuthContextVerified')
        }
      }
    };

    nblocksClientService = jasmine.createSpyObj('NblocksClientService', ['getNblocksClient']);
    tokenService = jasmine.createSpyObj('TokenService', ['getAccessToken']);
    logService = jasmine.createSpyObj('LogService', ['log']);
    loginService = jasmine.createSpyObj('LoginService', ['redirectToLogin']);

    nblocksClientService.getNblocksClient.and.returnValue(mockNblocksClient);

    TestBed.configureTestingModule({
      providers: [
        ProtectedRouteGuard,
        { provide: NblocksClientService, useValue: nblocksClientService },
        { provide: TokenService, useValue: tokenService },
        { provide: LogService, useValue: logService },
        { provide: LoginService, useValue: loginService }
      ]
    });

    guard = TestBed.inject(ProtectedRouteGuard);
  });

  it('should allow access when user has AUTHENTICATED scope', async () => {
    // Arrange
    const mockToken = 'valid-token';
    tokenService.getAccessToken.and.returnValue(mockToken);
    mockNblocksClient.auth.contextHelper.getAuthContextVerified.and.returnValue(
      Promise.resolve({ privileges: ['AUTHENTICATED'] })
    );

    // Act
    const result = await firstValueFrom(guard.canActivate(mockRoute, mockState));

    // Assert
    expect(result).toBe(true);
    expect(logService.log).toHaveBeenCalledWith('User has  the right to be on this route');
    expect(loginService.redirectToLogin).not.toHaveBeenCalled();
  });

  it('should redirect to login when no access token is present', async () => {
    // Arrange
    tokenService.getAccessToken.and.returnValue(undefined);

    // Act
    const result = await firstValueFrom(guard.canActivate(mockRoute, mockState));

    // Assert
    expect(result).toBe(false);
    expect(loginService.redirectToLogin).toHaveBeenCalled();
  });

  it('should redirect to login when user does not have AUTHENTICATED scope', async () => {
    // Arrange
    const mockToken = 'valid-token';
    tokenService.getAccessToken.and.returnValue(mockToken);
    mockNblocksClient.auth.contextHelper.getAuthContextVerified.and.returnValue(
      Promise.resolve({ privileges: ['OTHER_SCOPE'] })
    );

    // Act
    const result = await firstValueFrom(guard.canActivate(mockRoute, mockState));

    // Assert
    expect(result).toBe(false);
    expect(logService.log).toHaveBeenCalledWith('User has NOT the right to be on this route');
    expect(loginService.redirectToLogin).toHaveBeenCalled();
  });

  it('should redirect to login when auth context verification fails', async () => {
    // Arrange
    const mockToken = 'valid-token';
    tokenService.getAccessToken.and.returnValue(mockToken);
    mockNblocksClient.auth.contextHelper.getAuthContextVerified.and.returnValue(
      Promise.reject(new Error('Auth verification failed'))
    );

    // Act
    const result = await firstValueFrom(guard.canActivate(mockRoute, mockState));

    // Assert
    expect(result).toBe(false);
    expect(loginService.redirectToLogin).toHaveBeenCalled();
  });
}); 