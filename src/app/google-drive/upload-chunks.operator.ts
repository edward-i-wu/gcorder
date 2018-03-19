import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponseBase} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {switchMap, take, takeWhile} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const driveUploadBufferSize = environment.driveUploadBufferSize;

export function uploadBlobs(http: HttpClient, location$: Observable<string>, blob$: Observable<Blob>) {
  let byteProgress = 0;
  const blobUploadQueue = (location: string) => blob$.concatMap((blob: Blob) => {
    // TODO need retry logic
    const uploadRequest = http.post<string>(
      location,
      blob,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Content-Type': 'audio/mp3',
          'Content-Range': `bytes ${byteProgress}-${byteProgress + blob.size - 1}/${blob.size < driveUploadBufferSize ? byteProgress + blob.size : '*'}`
        })
      }
    ).catch((error: HttpErrorResponse) => {
      // TODO need better strategy for handling 308 success
      return Observable.of(error);
    });

    byteProgress += blob.size;
    return uploadRequest;
  });

  return location$.pipe(
    take(1), // TODO will completing the location stream affect concatmap?
    switchMap(blobUploadQueue),
    takeWhile((response: HttpResponseBase) => response.status !== 200 && response.status !== 201) // complete on 200/201
  );
}
