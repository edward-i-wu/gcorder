import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RoutingModule} from './routing.module';
import {InterfaceModule} from './interface/interface.module';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GoogleOauthModule} from './google-oauth/google-oauth.module';
import {AudioRecorderModule} from './audio-recorder/audio-recorder.module';
import {GoogleDriveModule} from './google-drive/google-drive.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InterfaceModule.forRoot(),
    GoogleOauthModule.forRoot(),
    AudioRecorderModule.forRoot(),
    GoogleDriveModule.forRoot(),
    RoutingModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
