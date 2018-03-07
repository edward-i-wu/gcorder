import { Component, OnInit } from '@angular/core';
import {GoogleAuthService} from '../../google-oauth/services/google-auth.service';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {GoogleUserService} from '../../google-oauth/services/google-user.service';
import {IsSignedInService} from '../../google-oauth/services/is-signed-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public googleUser$: Observable<any>;

  constructor(private googleUser: GoogleUserService, private isSignedIn: IsSignedInService, private router: Router) { }

  ngOnInit() {
    this.isSignedIn.$.subscribe(isSignedIn => {
      if (isSignedIn) {
        this.router.navigate(['webrtc']);
      }
    });

  }

  signIn() {
    this.googleUser.signIn();
  }

}
