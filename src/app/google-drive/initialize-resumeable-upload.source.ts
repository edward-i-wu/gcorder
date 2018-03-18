import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {switchMap, take} from 'rxjs/operators';

export function initializeResumeableUpload(http: HttpClient, accessToken$: Observable<string>): Observable<string> {

  return accessToken$.pipe(
    take(1),
    switchMap((accessToken: string) => http.post<string>(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      { name: `gcorder-${Date.now()}` }, // TODO more descriptive names
      {
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`,
          'X-Upload-Content-Type': 'audio/mp3',
        }),
        observe: 'response'
      })
    )
  ).map((resp: HttpResponse<string>) => resp.headers.get('Location'));
}
