import { TestBed, inject } from '@angular/core/testing';

import { VolumeDataService } from './volume-data.service';

describe('VolumeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolumeDataService]
    });
  });

  it('should be created', inject([VolumeDataService], (service: VolumeDataService) => {
    expect(service).toBeTruthy();
  }));
});
