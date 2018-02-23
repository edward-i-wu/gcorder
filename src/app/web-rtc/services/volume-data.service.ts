import {AfterViewInit, Injectable, OnDestroy} from '@angular/core';
import {FrequencyDataService} from './frequency-data.service';
import {ISubscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class VolumeDataService implements OnDestroy {

  private volumeData$: Observable<number>;
  private subscription: ISubscription;

  constructor(private frequencyData: FrequencyDataService) { }

  get $() {
    if (!this.subscription) {
      this.init();
    }

    return this.volumeData$;
  }

  init() {
    const pipe = new Subject<Uint8Array>();

    // "volume" strategy is to take the value of the highest bin
    this.volumeData$ = pipe.map((frequencyData: Uint8Array) => {
      return frequencyData.reduce((prev, curr) => {
        return Math.max(prev, curr);
      });
    });

    this.subscription = this.frequencyData.$.subscribe(pipe);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
