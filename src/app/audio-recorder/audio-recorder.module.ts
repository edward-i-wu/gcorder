import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AudioRecorderService} from './audio-recorder.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AudioRecorderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AudioRecorderModule,
      providers: [
        AudioRecorderService
      ]
    };
  }
}
