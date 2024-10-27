import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { LogService } from '../services/log.service';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedRouteGuard implements CanActivate {
  private readonly AUTHENTICATED_SCOPE = "AUTHENTICATED";

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private logService: LogService,
    private loginService: LoginService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.tokenService.accessToken$.pipe(
      take(1),
      switchMap(accessToken => this.doAuthorize(accessToken))
    );
  }

  private async doAuthorize(accessToken: string | undefined): Promise<boolean> {
    if (!accessToken) {
      this.loginService.redirectToLogin();
      return false;
    }

    try {
      const nblocksClient = this.nblocksClientService.getNblocksClient();
      const authCtx = await nblocksClient.auth.contextHelper.getAuthContextVerified(accessToken);
      const isGranted = this.isAuthenticated(authCtx);
      this.logService.log(`User has ${isGranted ? '' : 'NOT'} the right to be on this route`);
      
      if (!isGranted) {
        this.loginService.redirectToLogin();
      }
      
      return isGranted;
    } catch (error) {
      console.error(error);
      this.loginService.redirectToLogin();
      return false;
    }
  }

  private isAuthenticated(authCtx: any): boolean {
    return authCtx.privileges.includes(this.AUTHENTICATED_SCOPE);
  }
}
