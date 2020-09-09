import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalesService } from '@services/locales.service';
import { UserService } from '@services/user.service';
import { Locales } from '@interfaces/interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listar-locales',
  templateUrl: './listar-locales.component.html',
  styleUrls: ['./listar-locales.component.css'],
})
export class ListarLocalesComponent implements OnInit, OnDestroy {
  page: number = 1;
  totalPage: number;
  number_pages: any[];
  prev_page: number;
  next_page: number;
  contador: any[] = [];
  locales: Locales[] = [];
  searchLocales = new FormControl('');
  seachLocalesSubs: Subscription;
  token: string;
  existsSearch = false;
  pageSearch: number = 1;
  searSubs: Subscription;
  cargando: boolean = false;

  constructor(
    private _localesService: LocalesService,
    private _usService: UserService,
    private toastr: ToastrService,
    private _activateRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.token = this._usService.getToken;
    this.search();
  }

  ngOnInit(): void {
    this.loadQuryId();
  }

  ngOnDestroy() {
    // this.loadQuryId().unsubscribe();
    // this.getLocales().unsubscribe();
    // this.searSubs?.unsubscribe();
    this.searchLocales.reset();
  }

  public get nextDisabled(): boolean {
    return this.page >= this.contador?.length;
  }

  public get searchLocalesValue(): string {
    return this.searchLocales.value;
  }

  public get nextDisabledSearch(): boolean {
    return this.pageSearch >= this.contador?.length;
  }

  loadQuryId() {
    return this._activateRoute.queryParams.subscribe((resp: Params) => {
      const query = Number(resp['q']);
      const search = resp['search'];
      let page = Number(resp['page']);

      if (query && !search) {
        this.cargando = true;
        this.existsSearch = false;
        if (isNaN(query)) {
          this.page = 1;
          this.cargando = false;
          this._router.navigate([], { queryParams: { q: 1 } });
        } else {
          this.cargando = false;
          this.page = query;
        }
        this.getLocales();
      } else if (search && page && !query) {
        this.existsSearch = true;
        this.searchLocales.setValue(search);
        this.pageSearch = page;
        this.getSeaachLocales(search, page);
        this._router.navigate([], { queryParams: { search: search, page } });
      } else {
        this.existsSearch = false;
        this._router.navigate([], { queryParams: { q: 1 } });
      }

      // this.getLocales();
    });
  }

  getLocales() {
    this.cargando = true;
    return this._localesService.getLocales(this.page, this.token).subscribe(
      (resp) => {
        this.cargando = false;
        this.locales = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 10) {
          this.contador.push(contador++);
        }
      },
      (err) => {
        this.existsSearch = false;
        this.locales = [];
      }
    );
  }
  getSeaachLocales(value, page: number = 1) {
    this.searSubs = this._localesService
      .searchLocales(value, this.token, page)
      .subscribe(
        (resp) => {
          this.existsSearch = true;
          this.locales = resp.results;
          this.totalPage = resp.count;
          this.contador = [];
          let contador = 1;
          for (let i = 0; i < resp.count; i += 10) {
            this.contador.push(contador++);
          }
          this.cargando = false;
        },
        (err) => {
          this.existsSearch = false;
          this.cargando = false;
          this.locales = [];
        }
      );
  }

  cambioPagina(valor: number) {
    if (!this.existsSearch) {
      this._router.navigate(['/contable/locales'], {
        queryParams: { q: this.page += valor },
      });
      if (this.page < 1) {
        this._router.navigate(['/contable/locales'], {
          queryParams: { q: 1 },
        });
      } else if (this.page > this.totalPage) {
        this._router.navigate(['/contable/locales'], {
          queryParams: { q: this.page -= valor },
        });
      }
    } else {
      this._router.navigate(['/contable/locales'], {
        queryParams: {
          search: this.searchLocalesValue,
          page: this.pageSearch += valor,
        },
      });
      if (this.pageSearch < 1) {
        this._router.navigate(['/contable/locales'], {
          queryParams: { page: 1 },
        });
      } else if (this.pageSearch > this.totalPage) {
        this._router.navigate(['/contable/locales'], {
          queryParams: {
            search: this.searchLocalesValue,
            page: this.pageSearch -= valor,
          },
        });
      }
    }
  }

  deleteLocal(id: string, name: string) {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este Local?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.value) {
        return this._localesService
          .deleteLocal(id, this.token)
          .subscribe(() => {
            this.getLocales();
            this.toastr.success('Borrado!!', `${name} eliminado correctamente`);
          });
      }
    });
  }

  search() {
    this.searchLocales.valueChanges
      .pipe(debounceTime(350))
      .subscribe((value: string) => {
        this.cargando = true;

        if (value?.trim().length !== 0) {
          if (value !== null) {
            this._router.navigate([], {
              queryParams: { search: value, page: this.pageSearch },
            });
            this.getSeaachLocales(value, this.pageSearch);
          }
        } else {
          this.cargando = false;
          this.existsSearch = false;
          this.pageSearch = 1;
          this.searchLocales.reset();
          this.getLocales();
          this._router.navigate([], { queryParams: { q: 1 } });
          return;
        }
      });
  }

  restoreLocal() {
    this._localesService.restoreLocal(this.token).subscribe((resp) => {
      this.getLocales();
      this.toastr.success(
        `${resp.name}, ahora puedes buscarlo en el buscador`,
        'Local Restaurado!!'
      );
    });
  }

  trackByFn(index, local: Locales): number {
    return local.id;
  }
}
