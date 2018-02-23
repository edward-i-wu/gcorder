import {Injectable, OnDestroy} from '@angular/core';
import {UserMediaService} from './user-media.service';
import {ISubscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ConnectableObservable} from 'rxjs/Rx';

const BUFFER_SIZE = 2048;

@Injectable()
export class PcmDataService implements OnDestroy {

  private pcmData$: ConnectableObservable<Int16Array>;
  private subscription: ISubscription;
  private connection: ISubscription;
  private end$: Subject<any> = new Subject();

  private audioCtx: AudioContext = new AudioContext();

  constructor(private userMedia: UserMediaService) { }

  get $() {
    return this.pcmData$;
  }

  start() {
    this.connection = this.pcmData$.connect();
  }

  pause() {
    if (this.connection !== null) {
      this.connection.unsubscribe();
    }
  }

  stop() {
    this.end$.next('');
    this.subscription.unsubscribe();
  }

  init() {
    if (!this.subscription || this.subscription.closed) {
      // TODO why does this need to be a ReplaySubject?
      const pipe = new ReplaySubject<MediaStream>(1);

      this.pcmData$ = pipe.switchMap((stream: MediaStream) => {
        // TODO do these observables get cancelled (and released from memory) when init is called again?
        const output = new Subject<Int16Array>();
        const source = this.audioCtx.createMediaStreamSource(stream);
        const processor = this.audioCtx.createScriptProcessor(BUFFER_SIZE, 1, 1);
        processor.onaudioprocess = (event: AudioProcessingEvent) => {
          const float32Data = event.inputBuffer.getChannelData(0);
          const data = this._float32toInt16(float32Data);
          output.next(data);
        };
        source.connect(processor);
        // apparently data flows only once there is a destination?
        processor.connect(this.audioCtx.destination);

        return output.asObservable();
      })
        .takeUntil(this.end$)
        .multicast(new Subject());

      this.subscription = this.userMedia.$.subscribe(pipe);
    }
  }

  private _float32toInt16(float32: Float32Array): Int16Array {
    const int16 = new Int16Array(float32.length);
    float32.forEach((element, index) => int16[index] = this._convert(element));
    return int16;
  }

  private _convert(n) {
    // https://stackoverflow.com/questions/25839216/convert-float32array-to-int16array
    // TODO is there a better way to do this? Why are floats always [-1, 1]
    const v = n < 0 ? n * 32768 : n * 32767;       // convert in range [-32768, 32767]
    return Math.max(-32768, Math.min(32768, v)); // clamp
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
