import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NblocksClientService } from '../services/nblocks-client.service';
import { TokenService } from '../services/token.service';
import { LogService } from '../services/log.service';
import { NblocksConfigService } from '../services/nblocks-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: '<p>Loading...</p>'
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private logService: LogService,
    private configService: NblocksConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.handleCallback(code);
    }
  }

  private async handleCallback(code: string) {
    try {
      const nblocksClient = this.nblocksClientService.getNblocksClient();
      const { tokens } = await nblocksClient.auth.getTokensAndVerify(code);
      
      this.tokenService.setAccessToken(tokens.access_token);
      this.tokenService.setRefreshToken(tokens.refresh_token);

      if (tokens.id_token) {
        this.tokenService.setIdToken(tokens.id_token);
      }

      this.logService.log("Successfully resolved all tokens!");

      const config = this.configService.getConfig();
      this.router.navigate([config.handoverPath]);
    } catch (error) {
      console.error(error);
      alert("Could not login. Check developer console for more information.");
    }
  }
}
