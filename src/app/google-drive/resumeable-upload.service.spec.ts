import { TestBed, inject } from '@angular/core/testing';

import { ResumeableUploadService } from './resumeable-upload.service';

describe('ResumeableUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResumeableUploadService]
    });
  });

  it('should be created', inject([ResumeableUploadService], (service: ResumeableUploadService) => {
    expect(service).toBeTruthy();
  }));
});
