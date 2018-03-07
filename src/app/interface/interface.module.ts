import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {MatButtonModule, MatCardModule} from '@angular/material';
import {GoogleOauthModule} from '../google-oauth/google-oauth.module';
import {GoogleAuthGuardService} from './google-auth-guard.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    GoogleOauthModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class InterfaceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InterfaceModule,
      providers: [
        GoogleAuthGuardService
      ]
    };
  }
}
