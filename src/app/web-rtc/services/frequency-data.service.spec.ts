import { TestBed, inject } from '@angular/core/testing';

import { FrequencyDataService } from './frequency-data.service';

describe('FrequencyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrequencyDataService]
    });
  });

  it('should be created', inject([FrequencyDataService], (service: FrequencyDataService) => {
    expect(service).toBeTruthy();
  }));
});
