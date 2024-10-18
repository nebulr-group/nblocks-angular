 import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';


//TODO see if this can be moved to nblocks-angular
import * as process from 'process';
(window as any).process = process;
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
