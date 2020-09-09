import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, ClientsPages, ClientSimple } from '@interfaces/interfaces';
import { headers } from '@lib/header-config';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private URL: string;

  constructor(private _http: HttpClient) {
    this.URL = environment.url;
  }

  searchClients(
    value: string,
    token: string,
    page: number = 1
  ): Observable<ClientsPages> {
    let body = JSON.stringify({ search: value });
    return this._http.get<ClientsPages>(
      `${this.URL}/clients/?page=${page}&search=${value}`,
      {
        headers: headers(token),
      }
    );
  }

  getClients(page: number, token: string): Observable<ClientsPages> {
    return this._http
      .get<ClientsPages>(`${this.URL}/clients/?page=${page}`, {
        headers: headers(token),
      })
      .pipe(
        map((clients) => {
          return {
            ...clients,
            results: clients.results.map((client) => {
              if (client.active) {
                return client;
              }
            }),
          };
        })
      );
  }

  getClientAll(token: string): Observable<ClientsPages> {
    return this._http
      .get<ClientsPages>(`${this.URL}/clients/all/`, {
        headers: headers(token),
      })
      .pipe(
        map((clients) => {
          return {
            ...clients,
            results: clients.results.map((client) => {
              if (client.active) {
                return client;
              }
            }),
          };
        })
      );
  }

  getClientsToLocal(token: string): Observable<ClientSimple[]> {
    return this._http
      .get<ClientsPages>(`${this.URL}/clients/?limit=9000`, {
        headers: headers(token),
      })
      .pipe(
        map((clientPage) => clientPage.results),
        map((client) =>
          client.map((client) => {
            return {
              name: client.name,
              id: client.id,
              last_name: client.last_name,
            };
          })
        )
      );
  }

  getClientById(id: string, token: string): Observable<Client> {
    return this._http.get<Client>(`${this.URL}/clients/${id}/`, {
      headers: headers(token),
    });
  }

  createClient(client: Client, token: string): Observable<Client> {
    let body = JSON.stringify(client);

    return this._http.post<Client>(`${this.URL}/clients/`, body, {
      headers: headers(token),
    });
  }

  updateClient(id: string, client: Client, token: string): Observable<Client> {
    let body = JSON.stringify(client);
    return this._http.put<Client>(`${this.URL}/clients/${id}/`, body, {
      headers: headers(token),
    });
  }

  restoreClient(token: string): Observable<Client> {
    return this._http.get<Client>(`${this.URL}/clients/restore/`, {
      headers: headers(token),
    });
  }

  deleteClient(id: number, token: string) {
    return this._http.delete(`${this.URL}/clients/${id}/`, {
      headers: headers(token),
    });
  }
}
