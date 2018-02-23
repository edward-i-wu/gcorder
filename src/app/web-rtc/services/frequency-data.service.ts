import {Injectable, OnDestroy} from '@angular/core';
import {UserMediaService} from './user-media.service';
import {ISubscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Scheduler} from 'rxjs/Rx';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class FrequencyDataService implements OnDestroy {

  private frequencyData$: Observable<Uint8Array>;
  private subscription: ISubscription;

  constructor(private userMedia: UserMediaService) { }

  get $() {
    if (!this.subscription || this.subscription.closed) {
      this.init();
    }

    return this.frequencyData$;
  }

  init() {
    const pipe = new Subject<MediaStream>();

    this.frequencyData$ = pipe.switchMap((stream: MediaStream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 32;
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);

      return Observable.interval(0, Scheduler.animationFrame)
        .map(() => {
          analyser.getByteFrequencyData(frequencyData);
          return frequencyData.slice();
        });
    })
    .multicast(new Subject())
    .refCount();

    this.subscription = this.userMedia.$.subscribe(pipe);

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
