// TODO create zone operator

import {Observable} from 'rxjs/Observable';

export function loadGoogleAuth() {
  return new Observable((observer) => {
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
}


export function initGoogleAuth() {
  return new Observable((observer) => {
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
}
