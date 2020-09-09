import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Login, Token } from '../interfaces/interfaces';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { headers } from '@lib/header-config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL: string;
  private token: string;

  constructor(private _http: HttpClient, private _router: Router) {
    this.URL = environment.url;
    this.loadToken();
  }

  loadToken() {
    if (localStorage.getItem('x-token')) {
      this.token = localStorage.getItem('x-token');
    } else {
      this.token = null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('x-token', token);
    this.token = token;
  }

  get getToken() {
    return this.token;
  }

  updateProfile(token: string, body: any) {
    return this._http.put(`${this.URL}/users`, body, {
      headers: headers(token)
    })
  }

  verificarToken(): Observable<boolean> {
    return this._http
      .get(`${this.URL}/clients/all/`, {
        headers: headers(this.token),
      })
      .pipe(
        map(() => true),
        catchError(() => {
          localStorage.removeItem('x-token');
          return of(false);
        })
      );
  }

  login(user: Login): Observable<Token> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let body = JSON.stringify(user);

    return this._http
      .post<Token>(`${this.URL}/login/`, body, { headers })
      .pipe(
        map((resp) => {
          this.saveToken(resp.token);
          return resp;
        })
      );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('x-token');
    this._router.navigate(['/login'], { replaceUrl: true });
  }
}
