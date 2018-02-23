import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebRtcTestComponent} from './web-rtc-test/web-rtc-test.component';

const webRtcRoutes: Routes = [
  { path: 'webrtc', component: WebRtcTestComponent },
  { path: '**', redirectTo: 'webrtc', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forChild(webRtcRoutes) ],
  exports: [ RouterModule ]
})
export class WebRtcRoutingModule { }
