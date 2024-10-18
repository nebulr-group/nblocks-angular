import { FlagContext } from '@nebulr-group/nblocks-ts-client';

export interface NblocksConfig {
  appId: string;
  handoverPath: string;
  initialFlagsContext?: FlagContext;
  debug: boolean;
  stage: 'DEV' | 'STAGE' | 'PROD';
  disableRedirects: boolean;
}
