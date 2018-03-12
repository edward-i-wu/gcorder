import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {GoogleAuthService} from '../google-oauth/service/google-auth.service';

@Injectable()
export class GoogleAuthGuardService implements CanActivate {

  constructor(private googleAuthService: GoogleAuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.googleAuthService.isSignedIn$.do((isSignedIn: boolean) => {
      if (!isSignedIn) {
        this.router.navigate(['login']);
      }
    });
  }

}
