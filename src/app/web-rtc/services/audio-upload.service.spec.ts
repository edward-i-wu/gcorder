import { TestBed, inject } from '@angular/core/testing';

import { AudioUploadService } from './audio-upload.service';

describe('AudioUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioUploadService]
    });
  });

  it('should be created', inject([AudioUploadService], (service: AudioUploadService) => {
    expect(service).toBeTruthy();
  }));
});
