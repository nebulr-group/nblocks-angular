 import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { Buffer } from 'buffer';

(window as any).global = window;
(window as any).process = {
  env: {
    NODE_ENV: 'production',
    // other env vars...
  }
};
(window as any).Buffer = (window as any).Buffer || Buffer;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
