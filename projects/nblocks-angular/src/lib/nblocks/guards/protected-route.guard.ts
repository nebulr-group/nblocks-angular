import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { LogService } from '../services/log.service';
import { NblocksConfigService } from '../services/nblocks-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedRouteGuard implements CanActivate {
  private readonly AUTHENTICATED_SCOPE = "AUTHENTICATED";

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private logService: LogService,
    private configService: NblocksConfigService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('canActivate');
    return this.tokenService.accessToken$.pipe(
      take(1),
      switchMap(accessToken => this.doAuthorize(accessToken, route))
    );
  }

  private async doAuthorize(accessToken: string | undefined, route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    console.log('doAuthorize', accessToken);
    if (!accessToken) {
      console.log('no access token');
      return this.handleUnauthorized(route);
    }

    try {
      const nblocksClient = this.nblocksClientService.getNblocksClient();
      const authCtx = await nblocksClient.auth.contextHelper.getAuthContextVerified(accessToken);
      const isGranted = this.isAuthenticated(authCtx);
      this.logService.log(`User has ${isGranted ? '' : 'NOT'} the right to be on this route`);
      return isGranted ? true : this.handleUnauthorized(route);
    } catch (error) {
      console.error(error);
      return this.handleUnauthorized(route);
    }
  }

  private isAuthenticated(authCtx: any): boolean {
    return authCtx.privileges.includes(this.AUTHENTICATED_SCOPE);
  }

  private handleUnauthorized(route: ActivatedRouteSnapshot): UrlTree {
    const redirectTo = route.data['redirectTo'] || '/login';
    return this.router.parseUrl(redirectTo);
  }
}
