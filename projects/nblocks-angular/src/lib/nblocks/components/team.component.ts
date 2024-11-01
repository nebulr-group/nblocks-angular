import { Component, OnInit } from '@angular/core';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'nblocks-team',
  template: `
    <iframe *ngIf="portalUrl" [src]="portalUrl"></iframe>
    <p *ngIf="!portalUrl">Loading...</p>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    iframe {
      width: 100%;
      min-height: 100vh;
      height: 100%;
      border: none;
      display: block;
    }
  `]
})
export class TeamComponent implements OnInit {
  portalUrl: SafeResourceUrl | undefined;

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.getUrl().then(() => {
      const iframe = this.elementRef.nativeElement.firstElementChild as HTMLIFrameElement;
  
      iframe.addEventListener('load', () => {
        iframe.style.height = iframe.contentWindow?.document.body.scrollHeight + 'px';
      });
    });
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
