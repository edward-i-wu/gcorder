import { Component, OnInit } from '@angular/core';
import {GoogleAuthService} from '../../google-oauth/service/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private googleAuthService: GoogleAuthService) { }

  signIn() {
    this.googleAuthService.signIn();
  }

}
