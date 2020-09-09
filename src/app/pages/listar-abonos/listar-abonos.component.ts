import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonosService } from '@services/abonos.service';
import { UserService } from '@services/user.service';
import { Abonos } from '@interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-abonos',
  templateUrl: './listar-abonos.component.html',
  styleUrls: ['./listar-abonos.component.css'],
})
export class ListarAbonosComponent implements OnInit, OnDestroy {
  private page: number = 1;
  private token: string;
  public contador: Array<number> = [];
  public totalPage: number;
  public abonos: Abonos[] = [];
  public searchAbono = new FormControl('');
  public pageSearch: number = 1;
  public cargando: boolean = false;
  public existsSearch = false;

  constructor(
    private _abonosService: AbonosService,
    private usServices: UserService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _router: Router
  ) {
    this.token = this.usServices.getToken;
    this.search();
  }

  public get nextDisabled(): boolean {
    return this.page >= this.contador?.length;
  }

  public get nextDisabledSearch(): boolean {
    return this.pageSearch >= this.contador?.length;
  }
  public get searchClientesValue(): string {
    return this.searchAbono.value;
  }
  ngOnInit(): void {
    this.loadQuery();
    // this.searchAbonos();
  }

  ngOnDestroy() {
    // this.loadQuery().unsubscribe();
    // this.getAbonos().unsubscribe();
    this.searchAbono.reset();
  }

  loadQuery() {
    return this.activatedRoute.queryParams.subscribe((resp) => {
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
        this.getAbonos();
      } else if (search && page && !query) {
        this.existsSearch = true;
        this.searchAbono.setValue(search);
        this.pageSearch = page;
        this._router.navigate([], { queryParams: { search: search, page } });
        this.searchAbonos(search, page);
      } else {
        this.existsSearch = false;
        this._router.navigate([], { queryParams: { q: 1 } });
      }
    });
  }

  getAbonos() {
    this.cargando = true;
    return this._abonosService.listarAbonos(this.token, this.page).subscribe(
      (resp) => {
        this.cargando = false;
        this.abonos = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 2) {
          this.contador.push(contador++);
        }
      },
      () => {
        this.existsSearch = false;
        this.abonos = [];
      }
    );
  }

  cambioPagina(valor: number) {
    if (!this.existsSearch) {
      this._router.navigate(['/contable/abonos'], {
        queryParams: { q: this.page += valor },
      });
      if (this.page < 1) {
        this._router.navigate(['/contable/abonos'], {
          queryParams: { q: 1 },
        });
      } else if (this.page > this.totalPage) {
        this._router.navigate(['/contable/abonos'], {
          queryParams: { q: this.page -= valor },
        });
      }
    } else {
      this._router.navigate(['/contable/abonos'], {
        queryParams: {
          search: this.searchClientesValue,
          page: this.pageSearch += valor,
        },
      });
      if (this.pageSearch < 1) {
        this._router.navigate(['/contable/abonos'], {
          queryParams: { search: this.searchClientesValue, page: 1 },
        });
      } else if (this.pageSearch > this.totalPage) {
        this._router.navigate(['/contable/abonos'], {
          queryParams: {
            search: this.searchClientesValue,
            page: this.pageSearch -= valor,
          },
        });
      }
    }
  }

  async pagarAbono(id: number) {
    const password = 'pagarabono';
    const { value = '' } = await Swal.fire<string>({
      title: 'Pagar Abono',
      text: 'Ingrese La contraseña',
      input: 'password',
      inputPlaceholder: '************',
      showCancelButton: true,
    });

    if (value !== password) {
      Swal.fire('Contraseña Incorrecta', 'Verifica los datos', 'error');
    }

    if (value?.trim().length > 0 && value?.trim() === password) {
      this._abonosService.pagarAbono(id, this.token).subscribe((resp) => {
        this.toastr.success(`No. ${resp.id}`, 'Abono pagada');
        this.getAbonos();
      });
    }
  }

  restoreAbono() {
    this._abonosService.restaurarAbono(this.token).subscribe((resp) => {
      this.getAbonos();

      this.toastr.success(
        `Abono con id ${resp.id} restaurado, puedes buscarlo`,
        'Abono Restaurado!!'
      );
    });
  }

  search() {
    this.searchAbono.valueChanges
      .pipe(debounceTime(350))
      .subscribe((value: string) => {
        this.cargando = true;
        if (value?.trim().length !== 0) {
          if (value !== null) {
            this._router.navigate([], {
              queryParams: { search: value, page: this.pageSearch },
            });
          }

          this.searchAbonos(value, this.pageSearch);
        } else {
          this.cargando = false;
          this.existsSearch = false;
          this.getAbonos();
          this._router.navigate([], { queryParams: { q: 1 } });
          return;
        }
      });
  }

  searchAbonos(value, page: number = 1) {
    this._abonosService.searchAbonos(this.token, value, page).subscribe(
      (resp) => {
        this.existsSearch = true;
        this.abonos = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 2) {
          this.contador.push(contador++);
        }
        this.cargando = false;
      },
      (err) => {
        this.existsSearch = false;
        this.cargando = false;
        this.abonos = [];
      }
    );
  }

  eliminarAbono(id: number) {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este abono?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.value) {
        return this._abonosService
          .eliminarAbono(id, this.token)
          .subscribe(() => {
            this.getAbonos();
            this.toastr.success('Borrado!!', `Eliminado correctamente`);
          });
      }
    });
  }
}
