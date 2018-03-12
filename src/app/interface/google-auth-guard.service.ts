import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {IsSignedInService} from '../google-oauth/service/is-signed-in.service';

@Injectable()
export class GoogleAuthGuardService implements CanActivate {

  constructor(private isSignedIn: IsSignedInService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isSignedIn.$.do((isSignedIn: boolean) => {
      if (!isSignedIn) {
        this.router.navigate(['login']);
      }
    });
  }

}
