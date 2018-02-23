import { NgZone, Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

declare const gapi: any;

@Injectable()
export class ClientLoadService {

  private googleAuth: gapi.auth2.GoogleAuth;
  private isSignedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public accessToken$: ReplaySubject<string> = new ReplaySubject();

  constructor(private _ngZone: NgZone) { }

  get $() {
    return this.isSignedIn$.asObservable();
  }

  async init() {
    await this.loadClient();
    await this.initClient();
    this.initSignInListener();
  }

  loadClient(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._ngZone.run(() => {
        gapi.load('client', {
          callback: resolve,
          onerror: reject,
          timeout: 1000,
          ontimeout: reject
        });
      });
    });
  }

  initClient(): Promise<any> {
    return gapi.client.init({
      'apiKey': 'AIzaSyCv9CQTXJ_ziYCLLA5hlRk_0Lq6LrzgitA',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      'clientId': '1001160351132-p1fh24qd1s7ne1ffd6fj6nhil67nao39.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/drive.file'
    });
  }

  initSignInListener() {
    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.isSignedIn.listen((isSignedIn: boolean) => {
      console.log('isSignedIn: ', isSignedIn);
      this.isSignedIn$.next(isSignedIn);
      if (isSignedIn) {
        this.accessToken$.next(this.googleAuth.currentUser.get().getAuthResponse().access_token);
      }
    });

  }

  signIn() {
    this.googleAuth.signIn();
  }

  signOut() {
    this.googleAuth.signOut();
  }

  revoke() {
    this.googleAuth.disconnect();
  }

}
