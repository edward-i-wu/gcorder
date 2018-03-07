import { TestBed, inject } from '@angular/core/testing';

import { IsSignedInService } from './is-signed-in.service';

describe('IsSignedInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsSignedInService]
    });
  });

  it('should be created', inject([IsSignedInService], (service: IsSignedInService) => {
    expect(service).toBeTruthy();
  }));
});
