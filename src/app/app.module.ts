import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {WebRtcModule} from './web-rtc/web-rtc.module';
import {RoutingModule} from './routing.module';
import {InterfaceModule} from './interface/interface.module';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GoogleOauthModule} from './google-oauth/google-oauth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WebRtcModule.forRoot(),
    InterfaceModule.forRoot(),
    GoogleOauthModule.forRoot(),
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
