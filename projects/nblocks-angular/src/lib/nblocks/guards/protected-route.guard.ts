import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
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
    return from(this.authorize());
  }

  private async authorize(): Promise<boolean> {
    const accessToken = this.tokenService.getAccessToken();

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

  private isAuthenticated(authCtx: { privileges: string[] }): boolean {
    return authCtx.privileges.includes(this.AUTHENTICATED_SCOPE);
  }
}
