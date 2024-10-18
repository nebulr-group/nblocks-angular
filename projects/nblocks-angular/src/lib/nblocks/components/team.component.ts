import { Component, OnInit } from '@angular/core';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-team',
  template: `
    <iframe *ngIf="portalUrl" [src]="portalUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    <p *ngIf="!portalUrl">Loading...</p>
  `
})
export class TeamComponent implements OnInit {
  portalUrl: SafeResourceUrl | undefined;

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getUrl();
  }

  private async getUrl() {
    try {
      const accessToken = await this.tokenService.accessToken$.pipe(take(1)).toPromise();
      if (accessToken) {
        const nblocksClient = this.nblocksClientService.getNblocksClient();
        const codeResponse = await nblocksClient.auth.getHandoverCode(accessToken as string);
        const url = nblocksClient.portal.getUserManagementUrl(codeResponse.code);
        this.portalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
