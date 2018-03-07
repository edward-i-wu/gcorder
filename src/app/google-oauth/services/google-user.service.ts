import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {GoogleAuthService} from './google-auth.service';

@Injectable()
export class GoogleUserService {

  private googleUser$: Observable<boolean>;
  private googleAuth;

  constructor(private googleAuthService: GoogleAuthService) { this.init(); }

  get $() {
    return this.googleUser$;
  }

  init() {
    this.googleAuthService.$.subscribe(googleAuth => this.googleAuth = googleAuth);

    // TODO ngZone?
    const currentUser = this.googleAuthService.$.switchMap(googleAuth => {
      const user = googleAuth.currentUser.get();
      return !user ? Observable.never() : Observable.of(user);
    });
    const futureUsers = this.googleAuthService.$.switchMap(googleAuth => {
      const listener = googleAuth.currentUser.listen.bind(googleAuth);
      return Observable.bindCallback(listener)();
    });
    this.googleUser$ = Observable.merge(currentUser, futureUsers);
  }

  signIn() {
    // TODO handle error?
    this.googleAuth.signIn();
  }

  signOut() {
    // TODO handle error?
    this.googleAuth.signOut();
  }

  revoke() {
    this.googleAuth.disconnect();
  }

}
