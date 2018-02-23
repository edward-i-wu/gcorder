import { TestBed, inject } from '@angular/core/testing';

import { PcmDataService } from './pcm-data.service';

describe('PcmDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PcmDataService]
    });
  });

  it('should be created', inject([PcmDataService], (service: PcmDataService) => {
    expect(service).toBeTruthy();
  }));
});
