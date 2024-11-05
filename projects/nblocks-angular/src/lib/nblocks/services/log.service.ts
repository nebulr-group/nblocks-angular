import { Injectable } from '@angular/core';
import {Log} from "@nebulr-group/nblocks-ts-client/engine";
import { NblocksConfigService } from './nblocks-config.service';

@Injectable({
  providedIn: 'root'
})
export class LogService extends Log {
  
  constructor(private configService: NblocksConfigService) {
    super(configService.getConfig());
  }
}
