import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BlobBufferService, BUFFER_SIZE} from './blob-buffer.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class GdriveUploadService implements OnDestroy {

  private subscription: Subscription;
  private uploadUrl: string;
  private byteProgress = 0;

  constructor(
    private http: HttpClient,
    private blobBuffer: BlobBufferService
  ) { }

  initUploadQueue() {
    this.blobBuffer.init();

    const queueControl = new Subject();
    this.subscription = Observable
      .zip(
        this.blobBuffer.$,
        queueControl,
        (blob, control) => blob
      )
      .switchMap((blob: Blob) => {
        // TODO retry with backoff on failure
        const request = this.http.post<string>(
          this.uploadUrl,
          blob,
          {
            responseType: 'text' as 'json',
            headers: new HttpHeaders({
              'Content-Length': `${blob.size}`,
              'Content-Type': 'audio/mp3',
              'Content-Range': `bytes ${this.byteProgress}-${this.byteProgress + blob.size - 1}/${blob.size < BUFFER_SIZE ? this.byteProgress + blob.size : '*'}`
            })
          }
        )
        .catch((error: HttpErrorResponse) => {
          // TODO need better strategy for handling 308 success
          console.error(error);
          queueControl.next();
          return Observable.empty();
        });
        this.byteProgress += blob.size;

        return request;
      })
      .subscribe(
        (response) => {
          console.log(response);
          queueControl.next();
        },
        console.error,
        () => {
          // complete the upload by posting Content-Range: 100%
          this.http.post<string>(
            this.uploadUrl,
            null,
            {
              responseType: 'text' as 'json',
              headers: new HttpHeaders({
                'Content-Length': '0',
                'Content-Type': 'audio/mp3',
                'Content-Range': `bytes ${this.byteProgress}-${this.byteProgress}/${this.byteProgress}`
              })
            }
          ).subscribe(console.log, console.error);
        }
      );
    queueControl.next();
  }

  init(authToken: string) {
    // TODO what is type of response?
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${authToken}`,
        'X-Upload-Content-Type': 'audio/mp3',
        'Content-Length': '0'
      }),
      observe: 'response'
    };

    this.http.post<string>(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      '',
      {
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Authorization': `Bearer ${authToken}`,
          'X-Upload-Content-Type': 'audio/mp3',
          'Content-Length': '0'
        }),
        observe: 'response'
    })
      .subscribe((resp: HttpResponse<string>) => {
        console.log(resp.headers.get('Location'));
        this.uploadUrl = resp.headers.get('Location');
        this.initUploadQueue();
      }, console.error);
    // TODO handle empty response error
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
