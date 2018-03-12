import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BlobBufferService, BUFFER_SIZE} from './blob-buffer.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {ClientLoadService} from './client-load.service';
import {GoogleAuthService} from '../../google-oauth/service/google-auth.service';

@Injectable()
export class GdriveUploadService implements OnDestroy {

  private subscription: Subscription;
  private uploadUrl: string;
  private byteProgress = 0;
  private progress$: Observable<String | HttpErrorResponse>;

  constructor(
    private http: HttpClient,
    private blobBuffer: BlobBufferService,
    private googleAuth: GoogleAuthService
  ) { }

  get $() {
    return this.progress$;
  }

  init() {
    // initialize sources
    this.blobBuffer.init();
    // this.googleAuth.init();

    // create queue and queueControl to ensure chunk uploads happen in sequence
    const queueControl = new Subject();
    const blobQueue = Observable.zip(
      this.blobBuffer.$,
      queueControl,
      (blob, control) => blob
    );

    // trigger the first chunk upload when the first blob is available
    this.blobBuffer.$.first().subscribe(() => queueControl.next());

    this.progress$ = Observable.zip(
      // when the access token is available
      Observable.of(blobQueue),
      this.googleAuth.googleAuth$.map(auth => auth.currentUser.get().getAuthResponse(true).access_token),
      (blobQueue$, accessToken) => {
        // initialize the resumable upload
        return this.http.post<string>(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
          '',
          {
            responseType: 'text' as 'json',
            headers: new HttpHeaders({
              'Authorization': `Bearer ${accessToken}`,
              'X-Upload-Content-Type': 'audio/mp3',
            }),
            observe: 'response'
          }).switchMap((resp: HttpResponse<string>) => {
              // store the url for uploading chunks
              console.log(resp.headers.get('Location'));
              this.uploadUrl = resp.headers.get('Location');

              return blobQueue$;
          }).switchMap((blob: Blob) => {
            // then upload the first available blob
            const request = this.http.post<string>(
              this.uploadUrl,
              blob,
              {
                responseType: 'text' as 'json',
                headers: new HttpHeaders({
                  'Content-Type': 'audio/mp3',
                  'Content-Range': `bytes ${this.byteProgress}-${this.byteProgress + blob.size - 1}/${blob.size < BUFFER_SIZE ? this.byteProgress + blob.size : '*'}`
                })
              }
            ).catch((error: HttpErrorResponse) => {
              // TODO need better strategy for handling 308 success
              console.error(error);
              queueControl.next();
              return Observable.of(error);
            });
            this.byteProgress += blob.size;

            return request;
          }
        );
      }
    ).switchMap(obs => obs);
  }

  // init(authToken: string) {
  //
  //   this.http.post<string>(
  //     'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
  //     '',
  //     {
  //       responseType: 'text' as 'json',
  //       headers: new HttpHeaders({
  //         'Authorization': `Bearer ${authToken}`,
  //         'X-Upload-Content-Type': 'audio/mp3',
  //         'Content-Length': '0'
  //       }),
  //       observe: 'response'
  //   })
  //     .subscribe((resp: HttpResponse<string>) => {
  //       console.log(resp.headers.get('Location'));
  //       this.uploadUrl = resp.headers.get('Location');
  //       this.initUploadQueue();
  //     }, console.error);
  //   // TODO handle empty response error
  // }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
