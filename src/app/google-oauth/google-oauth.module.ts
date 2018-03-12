import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoogleAuthService} from './service/google-auth.service';
import {GoogleUserService} from './service/google-user.service';
import {IsSignedInService} from './service/is-signed-in.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class GoogleOauthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GoogleOauthModule,
      providers: [
        GoogleAuthService,
        GoogleUserService,
        IsSignedInService
      ]
    };
  }
}
