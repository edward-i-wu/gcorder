import { Component } from '@angular/core';
import {GoogleUserService} from './google-oauth/service/google-user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // TODO don't put stuff in appComponent?
  constructor(private googleUser: GoogleUserService, private router: Router) {}

  signOut() {
    this.googleUser.signOut();
    this.router.navigate(['login']);
  }

  revoke() {
    this.googleUser.revoke();
    this.router.navigate(['login']);
  }

}
