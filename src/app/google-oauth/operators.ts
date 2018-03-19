import {Observable} from 'rxjs/Observable';
import {map, switchMap} from 'rxjs/operators';

export function listenForSignInState(zone) {
  return (source: Observable<gapi.auth2.GoogleAuth>) => {
    const getCurrentState = () => map((googleAuth: gapi.auth2.GoogleAuth) => zone.run(() => googleAuth.isSignedIn.get()));
    const listenForFutureStates = () => switchMap((googleAuth: gapi.auth2.GoogleAuth) => {
      const zonedListener = (callback: (isSignedIn: boolean) => void) => {
        const zonedCallback = (isSignedIn: boolean) => {
          zone.run(() => {
            callback(isSignedIn);
          });
        };
        googleAuth.isSignedIn.listen(zonedCallback);
      };
      return Observable.bindCallback(zonedListener)();
    });
    return Observable.merge(source.pipe(getCurrentState()), source.pipe(listenForFutureStates()));
  };
}

export function listenForGoogleUser(zone) {
  return (source: Observable<gapi.auth2.GoogleAuth>) => {
    const getCurrentUser = () => switchMap((googleAuth: gapi.auth2.GoogleAuth) => {
      const user = zone.run(() => googleAuth.currentUser.get());
      return !user ? Observable.never() : Observable.of(user);
    });
    const listenForFutureUsers = () => switchMap((googleAuth: gapi.auth2.GoogleAuth) => {
      const zonedListener = (callback: (googleUser: gapi.auth2.GoogleUser) => void) => {
        const zonedCallback = (googleUser: gapi.auth2.GoogleUser) => {
          zone.run(() => {
            callback(googleUser);
          });
        };
        googleAuth.currentUser.listen(zonedCallback);
      };
      return Observable.bindCallback(zonedListener)();
    });
    return Observable.merge(source.pipe(getCurrentUser()), source.pipe(listenForFutureUsers()));
  };
}
