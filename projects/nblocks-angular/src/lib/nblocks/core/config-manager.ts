import { NblocksConfig } from '../models/nblocks-config.model';

export class ConfigManager {
  protected config: NblocksConfig;
  protected isConfigSet: boolean = false;

  constructor() {
    this.config = {
      appId: '',
      handoverPath: '/',
      debug: false,
      stage: 'PROD',
      disableRedirects: false
    };
  }

  setConfig(config: Partial<NblocksConfig>): void {
    this.config = { ...this.config, ...config };
    this.isConfigSet = true;
    this.validateConfig();
  }

  getConfig(): NblocksConfig {
    this.validateConfig();
    return this.config;
  }

  protected validateConfig(): void {
    if (!this.isConfigSet) {
      throw new Error('Configuration has not been set. Please call setConfig() before using the service.');
    }
    if (!this.config.appId) {
      throw new Error('appId is required and must be set.');
    }
  }
}
