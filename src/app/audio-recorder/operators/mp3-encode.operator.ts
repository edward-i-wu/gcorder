import {Observable} from 'rxjs/Observable';
import {takeWhile} from 'rxjs/operators';
import {ISubscription} from 'rxjs/Subscription';
import {using} from 'rxjs/observable/using';

// TODO use WebWorker.eventlistener?

export function mp3Encode() {

  return (pcmData$: Observable<Int16Array>) => {
    const resourceFactory = () => new WorkerResource('worker/worker.js');
    const mp3Data$Factory = (resource: WorkerResource) => new Observable((observer) => {
      let worker = resource.worker;

      const onComplete = () => {
        worker.postMessage(null);
      };

      const onEncodedData = (event: MessageEvent) => {
        if (event.data === null) {
          worker.terminate();
          worker = null;
        }
        observer.next(event.data as Int8Array);
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
    });

    return using(resourceFactory, mp3Data$Factory).pipe(
      takeWhile((mp3Data: Int8Array) => mp3Data != null)
    );
  };
}

class WorkerResource implements ISubscription {

  public worker: Worker;
  public closed = false;

  constructor(scriptPath: string) {
    this.worker = new Worker(scriptPath);
  }

  unsubscribe(): void {
    this.worker.terminate();
    this.closed = true;
  }

}
