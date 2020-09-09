import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Client, FacturasPages, Facture } from '@interfaces/interfaces';
import { Observable } from 'rxjs';
import { headers } from '@lib/header-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private URL: string;

  constructor(private _http: HttpClient) {
    this.URL = environment.url;
  }

  getFacturaById(id: number, token: string): Observable<Facture> {
    return this._http.get<Facture>(`${this.URL}/bills/${id}/`, {
      headers: headers(token),
    });
  }

  searchFactura(
    value: string,
    token: string,
    page: number = 1
  ): Observable<FacturasPages> {
    return this._http.get<FacturasPages>(
      `${this.URL}/bills/?page=${page}&browser=${value}`,
      {
        headers: headers(token),
      }
    );
  }

  getFacturas(page: number, token: string): Observable<FacturasPages> {
    return this._http.get<FacturasPages>(`${this.URL}/bills/?page=${page}`, {
      headers: headers(token),
    });
  }

  generarFactura(inforFactura, token: string) {
    let body = JSON.stringify(inforFactura);
    return this._http.post(`${this.URL}/bills/`, body, {
      headers: headers(token),
    });
  }

  pagarFactura(id: number, token: string): Observable<Facture> {
    return this._http.put<Facture>(`${this.URL}/bills/${id}/`, null, {
      headers: headers(token),
    });
  }

  restoreFactura(token: string): Observable<Facture> {
    return this._http.get<Facture>(`${this.URL}/bills/restore/`, {
      headers: headers(token),
    });
  }

  deleteFactura(id: string, token: string) {
    return this._http.delete(`${this.URL}/bills/${id}/`, {
      headers: headers(token),
    });
  }

  definitRangoFactura(data: { start: number; end: number }, token: string) {
    const body = JSON.stringify(data);
    return this._http.post(`${this.URL}/settings/`, body, {
      headers: headers(token),
    });
  }

  getRangoFactura(token: string) {
    return this._http.get(`${this.URL}/settings/`, {
      headers: headers(token),
    });
  }

  deleteRangoFactura(token: string) {
    return this._http.delete(`${this.URL}/settings/`, {
      headers: headers(token),
    });
  }
}
