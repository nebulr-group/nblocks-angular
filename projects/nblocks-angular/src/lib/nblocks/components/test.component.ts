import { Component } from '@angular/core';
import { NblocksConfigService } from '../services/nblocks-config.service';

@Component({
  selector: 'nblocks-test',
  template: '<p>Hello world from Nblocks with app id {{appId}}!</p>'
})
export class TestComponent {
  appId: string;

  constructor(private configService: NblocksConfigService) {
    this.appId = this.configService.getConfig().appId;
  }
}
