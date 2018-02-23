import {Injectable, OnDestroy} from '@angular/core';
import {PcmDataService} from './pcm-data.service';
import {ISubscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Mp3EncoderService implements OnDestroy {

  private worker: Worker;
  // TODO should this be multicasted?
  private mp3Data$: Subject<Int8Array> = new Subject<Int8Array>();
  private subscription: ISubscription;

  constructor(private pcmData: PcmDataService) { }

  get $() {
    return this.mp3Data$.asObservable()
      .takeWhile((mp3Data: Int8Array) => mp3Data != null);
  }

  init() {
    if ((!this.subscription || this.subscription.closed) && this.worker == null) {
      this.pcmData.init();
      this.worker = new Worker('worker/worker.js');
      this.worker.onmessage = this.onWorkerReady.bind(this);
    }
  }

  private onWorkerReady(event: MessageEvent) {
    if (event.data === 'ready') {
      this.worker.onmessage = this.onEncodedData.bind(this);

      this.subscription = this.pcmData.$.subscribe({
        next: (data: Int16Array) => {
          this.worker.postMessage(data);
        },
        complete: this.onComplete.bind(this)
      });
    }

  }

  private onEncodedData(event: MessageEvent) {
    if (event.data === null) {
      this.worker.terminate();
      this.worker = null;
    }

    this.mp3Data$.next(event.data as Int8Array);
  }

  private onComplete() {
    this.worker.postMessage(null);
  }

  ngOnDestroy() {
    this.worker.terminate();
    this.subscription.unsubscribe();
  }

}
