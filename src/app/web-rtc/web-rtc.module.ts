import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AudioUploadService} from './services/audio-upload.service';
import {FrequencyDataService} from './services/frequency-data.service';
import {Mp3EncoderService} from './services/mp3-encoder.service';
import {PcmDataService} from './services/pcm-data.service';
import {UserMediaService} from './services/user-media.service';
import {VolumeDataService} from './services/volume-data.service';
import { WebRtcTestComponent } from './web-rtc-test/web-rtc-test.component';
import {Mp3BlobService} from './services/mp3-blob.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GdriveUploadService} from './services/gdrive-upload.service';
import {BlobBufferService} from './services/blob-buffer.service';
import {Resumable308Interceptor} from './services/resumable308-interceptor.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [WebRtcTestComponent]
})
export class WebRtcModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WebRtcModule,
      providers: [
        AudioUploadService,
        FrequencyDataService,
        Mp3EncoderService,
        PcmDataService,
        UserMediaService,
        VolumeDataService,
        Mp3BlobService,
        GdriveUploadService,
        BlobBufferService,
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: Resumable308Interceptor,
        //   multi: true
        // }
      ]
    };
  }
}
