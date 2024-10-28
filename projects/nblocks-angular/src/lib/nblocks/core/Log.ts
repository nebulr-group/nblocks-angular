
import { NblocksConfig } from '../models/nblocks-config.model';
  export class Log {
    private config: NblocksConfig;
  
    constructor(config: NblocksConfig) {
      this.config = config; // Store the full config object
    }
  
    log(msg: string, emphasize: boolean = false): void {
      if (this.config && this.config.debug) {
        if (emphasize) {
          console.log('#######################');
          console.log(`Nblocks: ${new Date().toISOString()} - ${msg}`);
          console.log('#######################');
        } else {
          console.log(`Nblocks: ${new Date().toISOString()} - ${msg}`);
        }
      }
    }
  
    logError(...data: any[]): void {
      if (this.config && this.config.debug) {
        console.error(`Nblocks: ${new Date().toISOString()} - Error!`);
        console.error(...data);
      }
    }
  }
  