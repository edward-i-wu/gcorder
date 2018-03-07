import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './interface/login/login.component';
import {WebRtcTestComponent} from './web-rtc/web-rtc-test/web-rtc-test.component';
import {GoogleAuthGuardService} from './interface/google-auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'webrtc', component: WebRtcTestComponent, canActivate: [GoogleAuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
