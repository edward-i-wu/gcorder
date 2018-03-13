import {Observable} from 'rxjs/Observable';
import {share, takeUntil, takeWhile} from 'rxjs/operators';

// TODO use using operator to create/destroy worker

export function encodeToMp3() {
  return (pcmData$: Observable<Int16Array>) => new Observable(observer => {
    let worker = new Worker('worker/worker.js');

    const onEncodedData = (event: MessageEvent) => {
      if (event.data === null) {
        worker.terminate();
        worker = null;
      }
      observer.next(event.data as Int8Array);
    };

    const onComplete = () => {
      worker.postMessage(null);
    };

    const onWorkerReady = (event: MessageEvent) => {
      if (event.data === 'ready') {
        worker.onmessage = onEncodedData;

        pcmData$.subscribe({
          next: (data: Int16Array) => {
            worker.postMessage(data);
          },
          complete: onComplete
        });
      }
    };

    worker.onmessage = onWorkerReady;
  }).pipe(
    takeWhile((mp3Data: Int8Array) => mp3Data != null),
    share()
    );
}
