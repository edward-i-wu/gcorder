import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {initializeResumeableUpload} from './initialize-resumeable-upload.source';
import {uploadBlobs} from './upload-chunks.source';

@Injectable()
export class ResumeableUploadService {

  constructor(private http: HttpClient) { }

  uploadBinary(blob$: Observable<Blob>, accessToken$: Observable<string>) {
    const location$ = initializeResumeableUpload(this.http, accessToken$);
    return uploadBlobs(this.http, location$, blob$);
  }

}
