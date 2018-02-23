import { TestBed, inject } from '@angular/core/testing';

import { Mp3EncoderService } from './mp3-encoder.service';

describe('Mp3EncoderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Mp3EncoderService]
    });
  });

  it('should be created', inject([Mp3EncoderService], (service: Mp3EncoderService) => {
    expect(service).toBeTruthy();
  }));
});
