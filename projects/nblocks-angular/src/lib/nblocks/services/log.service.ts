import { Injectable } from '@angular/core';
import { NblocksConfigService } from './nblocks-config.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private configService: NblocksConfigService) {}

  log(msg: string, emphasize = false) {
    if (this.configService.getConfig().debug) {
      if (emphasize) {
        console.log('#######################');
        console.log(`Nblocks: ${new Date().toISOString()} - ${msg}`);
        console.log('#######################');
      } else {
        console.log(`Nblocks: ${new Date().toISOString()} - ${msg}`);
      }
    }
  }

  logError(...data: any[]) {
    if (this.configService.getConfig().debug) {
      console.error(`Nblocks: ${new Date().toISOString()} - Error!`);
      console.error(data);
    }
  }
}
