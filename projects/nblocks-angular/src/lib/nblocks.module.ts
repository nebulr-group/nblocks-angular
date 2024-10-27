import { ModuleWithProviders, NgModule } from '@angular/core';
import { NblocksConfig } from './nblocks/models/nblocks-config.model';
import { NblocksConfigService } from './nblocks/services/nblocks-config.service';

@NgModule({
  // ... other module configurations
})
export class NblocksModule {
  static forRoot(config: Partial<NblocksConfig>): ModuleWithProviders<NblocksModule> {
    return {
      ngModule: NblocksModule,
      providers: [
        {
          provide: NblocksConfigService,
          useFactory: () => {
            const configService = new NblocksConfigService();
            configService.setConfig(config);
            return configService;
          }
        }
      ]
    };
  }
}
