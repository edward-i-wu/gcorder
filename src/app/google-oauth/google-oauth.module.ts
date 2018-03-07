import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoogleAuthService} from './services/google-auth.service';
import {GoogleUserService} from './services/google-user.service';
import {IsSignedInService} from './services/is-signed-in.service';

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
