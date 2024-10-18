import { Injectable } from '@angular/core';
import { NblocksPublicClient } from '@nebulr-group/nblocks-ts-client';
import { NblocksConfigService } from './nblocks-config.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class NblocksClientService {
  private nblocksClient: NblocksPublicClient;

  constructor(
    private configService: NblocksConfigService,
    private logService: LogService
  ) {
    const config = this.configService.getConfig();
    this.nblocksClient = new NblocksPublicClient({
      appId: config.appId,
      stage: config.stage,
      debug: config.debug
    });
    this.logService.log('New NblocksPublicClient instantiated!');
  }

  getNblocksClient(): NblocksPublicClient {
    return this.nblocksClient;
  }
}
