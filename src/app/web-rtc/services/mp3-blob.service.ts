import {Injectable, OnDestroy} from '@angular/core';
import {Mp3EncoderService} from './mp3-encoder.service';
import {ISubscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BlobBufferService} from './blob-buffer.service';

@Injectable()
export class Mp3BlobService implements OnDestroy {

  sourceSwitch$: ReplaySubject<Observable<Blob>> = new ReplaySubject(1);
  mp3Blob$: Observable<Blob> = this.sourceSwitch$.switchMap(obs => obs);
  subscription: ISubscription;

  constructor(private blobBuffer: BlobBufferService) { }

  get $() {
    return this.mp3Blob$;
  }

  init() {
    if (!this.subscription || this.subscription.closed) {
      this.blobBuffer.init();

      const pipe: Subject<Blob> = new Subject();

      const mp3Blob$ = pipe
        .reduce((acc, chunk): Blob[] => {
          acc.push(chunk);
          return acc;
        }, [])
        .map((binary: Blob[]) => new Blob(binary, {type: 'audio/mp3'}))
        .do({complete: () => this.init()});

      this.sourceSwitch$.next(mp3Blob$);
      this.subscription = this.blobBuffer.$.subscribe(pipe);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
