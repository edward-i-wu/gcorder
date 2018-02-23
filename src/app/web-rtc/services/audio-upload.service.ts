import {Injectable, OnDestroy} from '@angular/core';
import {ISubscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import {Mp3EncoderService} from './mp3-encoder.service';

@Injectable()
export class AudioUploadService implements OnDestroy {

  private socket: WebSocket;
  private subscription: ISubscription;

  constructor(private mp3Encoder: Mp3EncoderService) { }

  init() {
    // this.socket = new WebSocket('ws://localhost:3000');
    // this.socket.onopen = this.onSocketReady.bind(this);
    this.onSocketReady();
  }

  // event: Event
  onSocketReady() {
    // TODO close socket on complete
    this.subscription = this.mp3Encoder.$
      .subscribe(
        (mp3Data: Int8Array) => {
          console.log(mp3Data);
          //this.socket.send(mp3Data);
        },
        (error) => {
          // TODO error
        },
        () => {
          // TODO give reason
          //this.socket.close();
          console.log('upload complete');
        }
      );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      // TODO include reason
      this.socket.close();
    }
  }

}
