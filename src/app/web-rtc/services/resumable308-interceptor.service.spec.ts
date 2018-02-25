import { TestBed, inject } from '@angular/core/testing';

import { Resumable308InterceptorService } from './resumable308-interceptor.service';

describe('Resumable308InterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Resumable308InterceptorService]
    });
  });

  it('should be created', inject([Resumable308InterceptorService], (service: Resumable308InterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
