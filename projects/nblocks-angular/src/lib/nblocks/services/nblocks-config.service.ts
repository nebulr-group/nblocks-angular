import { Injectable } from '@angular/core';
import { ConfigManager } from '@nebulr-group/nblocks-ts-client/engine';

@Injectable({
  providedIn: 'root'
})
export class NblocksConfigService extends ConfigManager {
  constructor() {
    super();
  }
}
