import { TestBed, inject } from '@angular/core/testing';

import { ClientLoadService } from './client-load.service';

describe('GoogleAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientLoadService]
    });
  });

  it('should be created', inject([ClientLoadService], (service: ClientLoadService) => {
    expect(service).toBeTruthy();
  }));
});
