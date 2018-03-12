import {Injectable, NgZone} from '@angular/core';
import {GoogleAuthService} from './google-auth.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class IsSignedInService {

  private googleAuth;
  private onSignIn$: Subject<boolean>;
  private isSignedIn$: Observable<boolean>;

  constructor(private googleAuthService: GoogleAuthService, private _ngZone: NgZone) { this.init(); }

  get $() {
    return this.isSignedIn$;
  }

  init() {
    this.isSignedIn$ = this.googleAuthService.$.pipe(this.listenForSignInOut()).shareReplay(1);
  }

  listenForSignInOut() {
    // TODO source type Observable<GoogleAuth>
    return source => {
      const currentState: Observable<boolean> = source.map(googleAuth => this._ngZone.run(() => googleAuth.isSignedIn.get()));
      const futureStates = source.switchMap(googleAuth => {
        const zonedListener = (callback: (isSignedIn: boolean) => void) => {
          const zonedCallback = (isSignedIn: boolean) => {
            this._ngZone.run(() => {
              callback(isSignedIn);
            });
          };
          googleAuth.isSignedIn.listen(zonedCallback);
        };
        return Observable.bindCallback(zonedListener)();
      });
      return Observable.merge(currentState, futureStates);
    };
  }

  // signIn() {
  //   Observable.fromPromise(this.googleAuth.signIn()).map(() => true).subscribe(this.onSignIn$);
  // }

  // init() {
  //   this.googleAuthService.$.subscribe(googleAuth => this.googleAuth = googleAuth);
  //   // TODO why isn't the listener firing on first login? Gotta do this hackiness now...
  //   this.onSignIn$ = new Subject();
  //   const currentState = this.googleAuthService.$.map(googleAuth => this._ngZone.run(() => googleAuth.isSignedIn.get()));
  //   const futureStates = this.googleAuthService.$.switchMap(googleAuth => {
  //     const zonedListener = (callback: (isSignedIn: boolean) => void) => {
  //       const zonedCallback = (isSignedIn: boolean) => {
  //         this._ngZone.run(() => {
  //           callback(isSignedIn);
  //         });
  //       };
  //       googleAuth.isSignedIn.listen(zonedCallback);
  //     };
  //     // const listener = googleAuth.isSignedIn.listen.bind(googleAuth.isSignedIn);
  //     return Observable.bindCallback(zonedListener)();
  //   });
  //   this.isSignedIn$ = Observable.merge(currentState, futureStates, this.onSignIn$)
  //     .multicast(new ReplaySubject(1))
  //     .refCount();
  // }

}
