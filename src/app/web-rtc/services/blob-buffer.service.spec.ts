import { TestBed, inject } from '@angular/core/testing';

import { BlobBufferService } from './blob-buffer.service';

describe('BlobBufferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlobBufferService]
    });
  });

  it('should be created', inject([BlobBufferService], (service: BlobBufferService) => {
    expect(service).toBeTruthy();
  }));
});
