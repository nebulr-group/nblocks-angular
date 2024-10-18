import { Component, OnInit } from '@angular/core';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-subscription',
  template: '<p>Loading...</p>'
})
export class SubscriptionComponent implements OnInit {
  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.doRedirect();
  }

  private async doRedirect() {
    try {
      const accessToken = await this.tokenService.accessToken$.pipe(take(1)).toPromise();
      if (accessToken) {
        const nblocksClient = this.nblocksClientService.getNblocksClient();
        const codeResponse = await nblocksClient.auth.getHandoverCode(accessToken);
        const selectPlanUrl = nblocksClient.portal.getSelectPlanUrl(codeResponse.code);
        this.router.navigate(['/external', { externalUrl: selectPlanUrl }]);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
