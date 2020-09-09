import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClientsService } from '@services/clients.service';
import { UserService } from '@services/user.service';
import { Client } from '@interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css'],
})
export class ListarClientesComponent implements OnInit, OnDestroy {
  page: number = 1;
  totalPage: number;
  number_pages: number[] = [];
  contador: number[] = [];
  clients: Client[] = [];
  cargando: boolean = false;
  searchClient = new FormControl('');
  pageSeach: number = 1;
  existeSearch: boolean = false;
  private token;

  constructor(
    private _activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _clientService: ClientsService,
    private _router: Router,
    private _userService: UserService
  ) {
    this.token = this._userService.getToken;
    this.search();
  }

  ngOnInit(): void {
    this.loadQuryId();
  }

  ngOnDestroy() {
    // this.getClients().unsubscribe();
    // this.loadQuryId().unsubscribe();
    // this.search().unsubscribe();
    // this.searchClient.reset();
  }

  public get nextDisabled(): boolean {
    return this.page >= this.contador?.length;
  }

  public get nextDisabledSearch(): boolean {
    return this.pageSeach >= this.contador?.length;
  }
  public get searchClientesValue(): string {
    return this.searchClient.value;
  }

  loadQuryId() {
    this._activateRoute.queryParams.subscribe((queryParmas: Params) => {
      let query = Number(queryParmas['q']);
      let search = queryParmas['search'];
      let page = Number(queryParmas['page']);

      if (query && !search) {
        this.cargando = true;
        this.existeSearch = false;
        if (isNaN(query)) {
          this.page = 1;
          this.cargando = false;
          this._router.navigate([], { queryParams: { q: 1 } });
        } else {
          this.cargando = false;

          this.page = query;
        }
        this.getClients();
      } else if (search && page && !query) {
        this.existeSearch = true;
        this.searchClient.setValue(search);
        this.pageSeach = page;
        this._router.navigate([], { queryParams: { search: search, page } });
        this.searchClients(search, page);

        // this.getSeaachLocales(search, page);
      } else {
        this.existeSearch = false;
        this._router.navigate([], { queryParams: { q: 1 } });
      }
    });
  }
  getClients() {
    this.cargando = true;

    return this._clientService.getClients(this.page, this.token).subscribe(
      (resp) => {
        this.cargando = false;

        this.clients = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 10) {
          this.contador.push(contador++);
        }
      },
      (err) => {
        this.existeSearch = false;
        this.cargando = false;
        this.clients = [];
      }
    );
  }

  cambioPagina(valor: number) {
    if (!this.existeSearch) {
      this._router.navigate(['/contable/users'], {
        queryParams: { q: this.page += valor },
      });
      if (this.page < 1) {
        this._router.navigate(['/contable/users'], {
          queryParams: { q: 1 },
        });
      } else if (this.page > this.totalPage) {
        this._router.navigate(['/contable/users'], {
          queryParams: { q: this.page -= valor },
        });
      }
    } else {
      this._router.navigate(['/contable/users'], {
        queryParams: {
          search: this.searchClientesValue,
          page: this.pageSeach += valor,
        },
      });
      if (this.pageSeach < 1) {
        this._router.navigate(['/contable/users'], {
          queryParams: { search: this.searchClientesValue, page: 1 },
        });
      } else if (this.pageSeach > this.totalPage) {
        this._router.navigate(['/contable/users'], {
          queryParams: {
            search: this.searchClientesValue,
            page: this.pageSeach -= valor,
          },
        });
      }
    }
  }

  deleteClient(id: number, name: string) {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.value) {
        this._clientService.deleteClient(id, this.token).subscribe(() => {
          this.getClients();
          this.toastr.success('Borrado!!', `${name} eliminado correctamente`);
        });
      }
    });
  }

  search() {
    this.searchClient.valueChanges
      .pipe(debounceTime(350))
      .subscribe((value: string) => {
        this.cargando = true;
        console.log(value);

        if (value?.trim().length !== 0) {
          if (value !== null) {
            this._router.navigate([], {
              queryParams: { search: value, page: this.pageSeach },
            });
          }
          this.searchClients(value, this.pageSeach);
        } else {
          console.log(value);

          this.cargando = false;
          this.existeSearch = false;
          this.pageSeach = 1;
          this.searchClient.reset();
          this.getClients();
          this._router.navigate([], { queryParams: { q: 1 } });
          return;
        }
      });
  }

  searchClients(value, page: number = 1) {
    this._clientService.searchClients(value, this.token, page).subscribe(
      (resp) => {
        this.existeSearch = true;
        this.clients = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 10) {
          this.contador.push(contador++);
        }
        this.cargando = false;
      },
      (err) => {
        this.existeSearch = false;
        this.cargando = false;
        this.clients = [];
      }
    );
  }

  restoreClient() {
    this._clientService.restoreClient(this.token).subscribe((resp) => {
      this.getClients();
      this.toastr.success(
        `${resp.name}, ahora puedes buscarlo en el buscador`,
        'Cliente Restaurado!!'
      );
    });
  }

  trackByFn(index, client: Client): number {
    return client.id;
  }
}
