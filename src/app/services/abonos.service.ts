import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { headers } from '@lib/header-config';
import { PagesAbonos, Abonos } from '@interfaces/interfaces';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AbonosService {
  private URL: string = environment.url;

  constructor(private _http: HttpClient) {}

  listarAbonos(token: string, page: number = 1): Observable<PagesAbonos> {
    return this._http.get<PagesAbonos>(`${this.URL}/payments/?page=${page}`, {
      headers: headers(token),
    });
  }

  searchAbonos(
    token: string,
    value: string,
    page: number = 1
  ): Observable<PagesAbonos> {
    return this._http.get<PagesAbonos>(
      `${this.URL}/payments/?page=${page}&browser=${value}`,
      {
        headers: headers(token),
      }
    );
  }

  getAbonoById(token: string, id: number) {
    return this._http.get<Abonos>(`${this.URL}/payments/${id}/`, {
      headers: headers(token),
    });
  }

  crearAbono(abono: any, token: string) {
    return this._http.post(`${this.URL}/payments/`, abono, {
      headers: headers(token),
    });
  }

  eliminarAbono(id: number, token: string) {
    return this._http.delete(`${this.URL}/payments/${id}/`, {
      headers: headers(token),
    });
  }

  restaurarAbono(token: string): Observable<Abonos> {
    return this._http.get<Abonos>(`${this.URL}/payments/restore/`, {
      headers: headers(token),
    });
  }

  pagarAbono(id: number, token: string): Observable<Abonos> {
    return this._http.put<Abonos>(`${this.URL}/payments/${id}/`, null, {
      headers: headers(token),
    });
  }
}
