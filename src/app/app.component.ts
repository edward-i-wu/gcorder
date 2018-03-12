import { Component } from '@angular/core';

import {GoogleAuthService} from './google-oauth/service/google-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // TODO don't put stuff in appComponent?
  constructor(private googleAuthService: GoogleAuthService) {}

  signOut() {
    this.googleAuthService.signOut();
  }

  revoke() {
    this.googleAuthService.revoke();
  }

}
