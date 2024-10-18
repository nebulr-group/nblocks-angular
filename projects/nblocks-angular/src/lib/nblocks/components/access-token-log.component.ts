import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenService } from '../services/token.service';
import { NblocksClientService } from '../services/nblocks-client.service';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-access-token-log',
  template: ''
})
export class AccessTokenLogComponent implements OnInit, OnDestroy {
  private accessTokenSubscription: Subscription | undefined;

  constructor(
    private tokenService: TokenService,
    private nblocksClientService: NblocksClientService,
    private logService: LogService
  ) {}

  ngOnInit() {
    this.accessTokenSubscription = this.tokenService.accessToken$.subscribe(token => {
      const expDate = this.getExpDate(token);
      this.logService.log(`Hello from AccessTokenLog listening on accessToken which now expires ${expDate}`);
    });
  }

  ngOnDestroy() {
    if (this.accessTokenSubscription) {
      this.accessTokenSubscription.unsubscribe();
    }
  }

  private getExpDate(token?: string): string {
    if (token) {
      const nblocksClient = this.nblocksClientService.getNblocksClient();
      const expiration = nblocksClient.auth.contextHelper.getTokenExpiration(token);
      return new Date(expiration * 1000).toISOString();
    }
    return 'N/A';
  }
}
