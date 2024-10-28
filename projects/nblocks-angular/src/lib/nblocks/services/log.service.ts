import { Injectable } from '@angular/core';
import { Log } from '../core/log';
import { NblocksConfigService } from './nblocks-config.service';


@Injectable({
  providedIn: 'root'
})
export class LogService extends Log {
  
  constructor(private configService: NblocksConfigService) {
    super(configService.getConfig());
  }
}
