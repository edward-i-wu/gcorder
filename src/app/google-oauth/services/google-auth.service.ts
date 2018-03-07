import { NgZone, Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';

declare const gapi: any;

@Injectable()
export class GoogleAuthService {

  // TODO GoogleAuth type
  private googleAuth$: Observable<any>;

  constructor(private _ngZone: NgZone) { this.init(); }

  get $() {
    return this.googleAuth$;
  }

  init(): void {
    const auth2Load$: Subject<undefined> = new Subject();

    this.googleAuth$ = auth2Load$.switchMap(() => {
      const pipe: ReplaySubject<any> = new ReplaySubject(1);
      gapi.auth2.init({
        client_id: '1001160351132-p1fh24qd1s7ne1ffd6fj6nhil67nao39.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file'
      }).then((googleAuth) => {
          this._ngZone.run(() => pipe.next(googleAuth));
        }, (error) => {
          this._ngZone.run(() => pipe.error(error));
        }
      );
      return pipe.multicast(new ReplaySubject(1)).refCount().do(console.log);
    });
    
    this._ngZone.run(() => {
      gapi.load('client', {
        callback: auth2Load$.next.bind(auth2Load$),
        onerror: auth2Load$.error.bind(auth2Load$),
        timeout: 3000,
        ontimeout: auth2Load$.error.bind(auth2Load$)
      });
    });

  }

}
