import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}

  canActivate() {
    return this._userService.verificarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigate(['/login']);
        }
      })
    );
  }

  // canActivate(): boolean {
  //   if (!this._userService.getToken) {
  //     this._router.navigate(['/login']);
  //     return false;
  //   }

  //   return true;
  // }
}
