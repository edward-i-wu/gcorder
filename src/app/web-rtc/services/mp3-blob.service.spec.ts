import { TestBed, inject } from '@angular/core/testing';

import { Mp3BlobService } from './mp3-blob.service';

describe('Mp3BlobService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Mp3BlobService]
    });
  });

  it('should be created', inject([Mp3BlobService], (service: Mp3BlobService) => {
    expect(service).toBeTruthy();
  }));
});
