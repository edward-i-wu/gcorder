import { Injectable } from '@angular/core';
import {GoogleAuthService} from './google-auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class IsSignedInService {

  private isSignedIn$: Observable<boolean>;

  constructor(private googleAuth: GoogleAuthService) { this.init(); }

  get $() {
    return this.isSignedIn$;
  }

  init() {
    // TODO ngZone?
    const currentState = this.googleAuth.$.map(googleAuth => googleAuth.isSignedIn.get());
    const futureStates = this.googleAuth.$.switchMap(googleAuth => {
      const listener = googleAuth.isSignedIn.listen.bind(googleAuth.isSignedIn);
      return Observable.bindCallback(listener)();
    });
    this.isSignedIn$ = Observable.merge(currentState, futureStates);
  }

}
