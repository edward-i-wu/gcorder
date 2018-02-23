import { TestBed, inject } from '@angular/core/testing';

import { GdriveUploadService } from './gdrive-upload.service';

describe('GdriveUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GdriveUploadService]
    });
  });

  it('should be created', inject([GdriveUploadService], (service: GdriveUploadService) => {
    expect(service).toBeTruthy();
  }));
});
