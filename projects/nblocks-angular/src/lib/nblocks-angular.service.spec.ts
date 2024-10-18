import { TestBed } from '@angular/core/testing';

import { NblocksAngularService } from './nblocks-angular.service';

describe('NblocksAngularService', () => {
  let service: NblocksAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NblocksAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
