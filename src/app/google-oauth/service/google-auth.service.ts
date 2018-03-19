import { NgZone, Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {listenForGoogleUser, listenForSignInState} from './operators';
import {switchMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

declare const gapi: any;

@Injectable()
export class GoogleAuthService {

  // TODO GoogleAuth type
  public googleAuth$: Observable<gapi.auth2.GoogleAuth>;
  public googleUser$: Observable<gapi.auth2.GoogleUser>;
  public isSignedIn$: Observable<boolean>;

  constructor(private _ngZone: NgZone, private router: Router) { this.init(); }

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
        client_id: environment.clientId,
        scope: 'https://www.googleapis.com/auth/drive.file'
      }).then((googleAuth) => {
          this._ngZone.run(() => observer.next(googleAuth));
        }, (error) => {
          this._ngZone.run(() => observer.error(error));
        }
      );
    });

    this.googleAuth$ = loadGoogleAuth.pipe(switchMap(() => initGoogleAuth)).shareReplay(1);
    this.googleUser$ = this.googleAuth$.pipe(listenForGoogleUser(this._ngZone)).shareReplay(1);
    this.isSignedIn$ = this.googleAuth$.pipe(listenForSignInState(this._ngZone)).shareReplay(1);

    // TODO don't subscribe in init?
    this.isSignedIn$.subscribe((isSignedIn: boolean) => {
      if (isSignedIn) {
        this.router.navigate(['recorder']);
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  signIn() {
    // TODO handle error
    this.googleAuth$.pipe(
      take(1),
      switchMap((googleAuth: gapi.auth2.GoogleAuth) => Observable.fromPromise(googleAuth.signIn()))
    ).subscribe();
  }

  signOut() {
    this.googleAuth$.pipe(
      take(1),
      switchMap((googleAuth: gapi.auth2.GoogleAuth) => Observable.fromPromise(googleAuth.signOut()))
    ).subscribe();
  }

  revoke() {
    this.googleAuth$.pipe(
      take(1),
      switchMap((googleAuth: gapi.auth2.GoogleAuth) => Observable.fromPromise(googleAuth.disconnect()))
    ).subscribe();
  }

}
