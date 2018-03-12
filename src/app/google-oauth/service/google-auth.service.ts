import { NgZone, Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {listenForGoogleUser, listenForSignInState} from './operators';
import {switchMap} from 'rxjs/operators';

declare const gapi: any;

@Injectable()
export class GoogleAuthService {

  // TODO GoogleAuth type
  public googleAuth$: Observable<gapi.auth2.GoogleAuth>;
  public googleUser$: Observable<gapi.auth2.GoogleUser>;
  public isSignedIn$: Observable<boolean>;

  constructor(private _ngZone: NgZone) { this.init(); }

  get $() {
    return this.googleAuth$;
  }

  init() {
    // TODO move sources to sources.ts once they are independent
    const loadGoogleAuth = new Observable((observer) => {
      // TODO should this complete?
      const zonedOnNext = value => this._ngZone.run(() => observer.next(value));
      const zonedOnError = error => this._ngZone.run(() => observer.error(error));

      gapi.load('auth2', {
        callback: zonedOnNext,
        onerror: zonedOnError,
        timeout: 3000,
        ontimeout: zonedOnError
      });
    });

    const initGoogleAuth = new Observable<gapi.auth2.GoogleAuth>((observer) => {
      // TODO should this complete?
      gapi.auth2.init({
        client_id: '1001160351132-p1fh24qd1s7ne1ffd6fj6nhil67nao39.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file'
      }).then((googleAuth) => {
          this._ngZone.run(() => observer.next(googleAuth));
        }, (error) => {
          this._ngZone.run(() => observer.error(error));
        }
      );
    });

    this.googleAuth$ = loadGoogleAuth.pipe(switchMap(() => initGoogleAuth)).shareReplay(1);
    this.googleUser$ = this.googleAuth$.pipe(listenForGoogleUser()).shareReplay(1);
    this.isSignedIn$ = this.googleAuth$.pipe(listenForSignInState()).shareReplay(1);
  }

}
