import { Injectable } from '@angular/core';
import { NblocksConfig } from '../models/nblocks-config.model';

@Injectable({
  providedIn: 'root'
})
export class NblocksConfigService {
  private config: NblocksConfig;
  private isConfigSet: boolean = false;

  constructor() {
    this.config = {
      appId: '',
      handoverPath: '/',
      debug: false,
      stage: 'PROD',
      disableRedirects: false
    };
  }

  setConfig(config: Partial<NblocksConfig>) {
    this.config = { ...this.config, ...config };
    this.isConfigSet = true;
    this.validateConfig();
  }

  getConfig(): NblocksConfig {
    this.validateConfig();
    return this.config;
  }

  private validateConfig() {
    if (!this.isConfigSet) {
      throw new Error('NblocksConfigService: Configuration has not been set. Please call setConfig() before using the service.');
    }
    if (!this.config.appId) {
      throw new Error('NblocksConfigService: appId is required and must be set.');
    }
  }
}
