import {Observable} from 'rxjs/Observable';

export function createAudioContext(): Observable<AudioContext> {
  return new Observable(observer => observer.next(new AudioContext()));
}
