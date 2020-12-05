import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, private authService: AuthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.canActivateProtectedRoutes$
      .pipe(tap(x => {

        if (!x) {
          this.router.navigate(['register']);
        }
        this.authService.setHaveTenantId();

        console.log('You tried to go to ' + state.url + ' and this guard said ' + x)
      }));
  }
}
