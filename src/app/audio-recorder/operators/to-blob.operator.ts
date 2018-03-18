import {Observable} from 'rxjs/Observable';

export function toBlob(bufferSize: number): (number) => Observable<Blob> {
  // TODO generalize to TypedArray
  return (source: Observable<Int8Array>) => new Observable(observer => {
    let buffer: Int8Array[] = [];
    let blobSize = 0;

    const next = (chunk: Int8Array) => {
      if (chunk.byteLength + blobSize > bufferSize) {
        const splitIndex = ((chunk.byteLength + blobSize) - bufferSize) / chunk.BYTES_PER_ELEMENT;
        const lastChunk = chunk.slice(0, chunk.length - splitIndex);
        const nextChunk = chunk.slice(chunk.length - splitIndex);

        buffer.push(lastChunk);
        observer.next(new Blob(buffer));
        buffer = [];
        blobSize = 0;
        next(nextChunk); // in case nextChunk.byteLength > bufferSize. This might cause race condition?
      } else {
        buffer.push(chunk);
        blobSize += chunk.byteLength;
      }
    };
    const error = err => observer.error(err);
    const complete = () => {
      observer.next(new Blob(buffer));
      observer.complete();
    };
    source.subscribe(next, error, complete);
  });
}
