import {Injectable, OnDestroy} from '@angular/core';
import {Mp3EncoderService} from './mp3-encoder.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

export const BUFFER_SIZE = 256 * 1024;

@Injectable()
export class BlobBufferService implements OnDestroy {

  private blobBuffer$: Observable<Blob>;
  private buffer: Int8Array[] = [];
  private blobSize = 0;
  private subscription: Subscription;

  constructor(private mp3Encoder: Mp3EncoderService) { }

  get $() {
    return this.blobBuffer$;
  }

  init() {
    if (!this.subscription || this.subscription.closed) {
      this.mp3Encoder.init();
      const pipe: Subject<Blob> = new Subject();
      this.subscription = this.mp3Encoder.$.subscribe(
        (data: Int8Array) => {
          // TODO this will have unexpected behaviour if data.byteLength > BUFFER_SIZE * 2
          // maybe this could be done with pipe? Write a custom operator?
          if (data.byteLength + this.blobSize > BUFFER_SIZE) {
            const splitIndex = ((data.byteLength + this.blobSize) - BUFFER_SIZE) / data.BYTES_PER_ELEMENT;
            // TODO why do I have to do this to the index?
            const lastChunk = data.slice(0, data.length - splitIndex);
            const nextChunk = data.slice(data.length - splitIndex);

            this.buffer.push(lastChunk);
            pipe.next(new Blob(this.buffer));
            this.buffer = [nextChunk];
            this.blobSize = nextChunk.byteLength;
          } else {
            this.buffer.push(data);
            this.blobSize += data.byteLength;
          }
        },
        error => pipe.error(error),
        () => {
          pipe.next(new Blob(this.buffer));
          pipe.complete();
        }
      );
      this.blobBuffer$ = pipe.multicast(new Subject()).refCount();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
