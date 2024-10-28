import { Injectable } from '@angular/core';

import { ConfigManager } from '../core/config-manager';

@Injectable({
  providedIn: 'root'
})
export class NblocksConfigService extends ConfigManager {
  constructor() {
    super();
  }
}
