import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './interface/login/login.component';
import {GoogleAuthGuardService} from './interface/google-auth-guard.service';
import {RecorderComponent} from './interface/recorder/recorder.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recorder', component: RecorderComponent, canActivate: [GoogleAuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
