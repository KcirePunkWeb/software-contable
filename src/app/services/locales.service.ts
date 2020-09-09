import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Locales, LocalesPages } from '@interfaces/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { headers } from '@lib/header-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalesService {
  private URL: string;

  constructor(private _http: HttpClient) {
    this.URL = environment.url;
  }

  searchLocales(
    value: string,
    token: string,
    page: number = 1
  ): Observable<LocalesPages> {
    let body = JSON.stringify({ search: value });
    return this._http.get<LocalesPages>(
      `${this.URL}/places/?page=${page}&search=${value}`,
      {
        headers: headers(token),
      }
    );
  }

  getLocales(page: number, token: string): Observable<LocalesPages> {
    return this._http
      .get<LocalesPages>(`${this.URL}/places/?page=${page}`, {
        headers: headers(token),
      })
      .pipe(
        map((locales) => {
          return {
            ...locales,
          };
        })
      );
  }

  getLocalesById(id: string, token: string): Observable<Locales> {
    return this._http.get<Locales>(`${this.URL}/places/${id}/`, {
      headers: headers(token),
    });
  }

  saveLocal(local: Locales, token: string): Observable<Locales> {
    let body = JSON.stringify(local);
    return this._http.post<Locales>(`${this.URL}/places/`, body, {
      headers: headers(token),
    });
  }

  updateLocal(id: string, local: Locales, token: string): Observable<Locales> {
    let body = JSON.stringify(local);
    return this._http.put<Locales>(`${this.URL}/places/${id}/`, body, {
      headers: headers(token),
    });
  }

  restoreLocal(token: string): Observable<Locales> {
    return this._http.get<Locales>(`${this.URL}/places/restore/`, {
      headers: headers(token),
    });
  }

  deleteLocal(id: string, token: string) {
    return this._http.delete(`${this.URL}/places/${id}/`, {
      headers: headers(token),
    });
  }
}
