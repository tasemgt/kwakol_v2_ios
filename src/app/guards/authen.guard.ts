import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree, CanActivate } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];  route: ActivatedRouteSnapshot;

  constructor(private auth: AuthService){}

  public canActivate(): boolean | UrlTree{
    console.log('Can Activate >> ', this.auth.isAuthenticated());
    const isAuthenticated = this.auth.isAuthenticated();
    return isAuthenticated as boolean;
  }
}
