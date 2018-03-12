import { Component, OnInit } from '@angular/core';
import {GoogleAuthService} from '../../google-oauth/service/google-auth.service';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {IsSignedInService} from '../../google-oauth/service/is-signed-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public googleUser$: Observable<any>;

  constructor(private googleAuthService: GoogleAuthService, private isSignedIn: IsSignedInService, private router: Router) { }

  ngOnInit() {
    this.isSignedIn.$.subscribe(isSignedIn => {
      if (isSignedIn) {
        this.router.navigate(['webrtc']);
      }
    }, console.error);

  }

  signIn() {
    this.googleAuthService.$.take(1)
      .switchMap(googleAuth => Observable.fromPromise(googleAuth.signIn()))
      .subscribe();
  }

}
