import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResumeableUploadService} from './resumeable-upload.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class GoogleDriveModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GoogleDriveModule,
      providers: [
        ResumeableUploadService
      ]
    };
  }
}
