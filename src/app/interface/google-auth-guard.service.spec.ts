import { TestBed, inject } from '@angular/core/testing';

import { GoogleAuthGuardService } from './google-auth-guard.service';

describe('GoogleAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAuthGuardService]
    });
  });

  it('should be created', inject([GoogleAuthGuardService], (service: GoogleAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
