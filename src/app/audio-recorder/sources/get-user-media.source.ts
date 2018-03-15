import {Observable} from 'rxjs/Observable';

export function getUserMedia(constraints: MediaStreamConstraints): Observable<MediaStream> {
  // we must defer the fromPromise to make it a "cold" observable. Otherwise errors get thrown before there are subscribers
  return Observable.defer(() => {
    return Observable.fromPromise(navigator.mediaDevices.getUserMedia(constraints));
  });
}
