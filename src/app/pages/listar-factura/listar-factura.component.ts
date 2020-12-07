import { PasswordService } from './../../services/password.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacturaService } from '@services/factura.service';
import { UserService } from '@services/user.service';
import { Facture } from '@interfaces/interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-factura',
  templateUrl: './listar-factura.component.html',
  styleUrls: ['./listar-factura.component.css'],
})
export class ListarFacturaComponent implements OnInit, OnDestroy {
  idFactura: Array<number> = [];
  totalPage: number;
  page: number = 1;
  contador: any[] = [];
  facturas: Facture[] = [];
  pageSeach: number = 1;
  searchFactura = new FormControl('');
  existeSearch: boolean = false;
  cargando: boolean = false;
  private token: string;

  constructor(
    private _facturaService: FacturaService,
    private _usService: UserService,
    private toastr: ToastrService,
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _passwordService: PasswordService
  ) {
    this.token = this._usService.getToken;
    this.search();
  }

  ngOnInit(): void {
    this.loadQuryId();
  }

  ngOnDestroy() {
    // this.loadQuryId();
    // this.getFacturas();
    this.searchFactura.reset();
  }

  public get nextDisabled(): boolean {
    return this.page >= this.contador?.length;
  }

  public get nextDisabledSearch(): boolean {
    return this.pageSeach >= this.contador?.length;
  }
  public get searchClientesValue(): string {
    return this.searchFactura.value;
  }

  loadQuryId() {
    return this._activateRoute.queryParams.subscribe((queryParmas: Params) => {
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
        this.getFacturas();
      } else if (search && page && !query) {
        this.existeSearch = true;
        this.searchFactura.setValue(search);
        this.pageSeach = page;
        this._router.navigate([], { queryParams: { search: search, page } });
      } else {
        this.existeSearch = false;
        this._router.navigate([], { queryParams: { q: 1 } });
      }
    });
  }

  getFacturas() {
    this.cargando = true;
    return this._facturaService.getFacturas(this.page, this.token).subscribe(
      (resp) => {
        this.cargando = false;
        this.facturas = resp.results;
        this.totalPage = resp.count;
        this.contador = [];
        let contador = 1;
        for (let i = 0; i < resp.count; i += 10) {
          this.contador.push(contador++);
        }
      },
      () => {
        this.existeSearch = false;
        this.cargando = false;
        this.facturas = [];
      }
    );
  }

  cambioPagina(valor: number) {
    if (!this.existeSearch) {
      this._router.navigate(['/contable/facturas'], {
        queryParams: { q: (this.page += valor) },
      });
      if (this.page < 1) {
        this._router.navigate(['/contable/facturas'], {
          queryParams: { q: 1 },
        });
      } else if (this.page > this.totalPage) {
        this._router.navigate(['/contable/facturas'], {
          queryParams: { q: (this.page -= valor) },
        });
      }
    } else {
      this._router.navigate(['/contable/facturas'], {
        queryParams: {
          search: this.searchClientesValue,
          page: (this.pageSeach += valor),
        },
      });
      if (this.pageSeach < 1) {
        this._router.navigate(['/contable/facturas'], {
          queryParams: { search: this.searchClientesValue, page: 1 },
        });
      } else if (this.pageSeach > this.totalPage) {
        this._router.navigate(['/contable/facturas'], {
          queryParams: {
            search: this.searchClientesValue,
            page: (this.pageSeach -= valor),
          },
        });
      }
    }
  }

  async pagarFactura(id: number) {
    const password = 'pagarfactura';
    const { value = '' } = await Swal.fire<string>({
      title: 'Pagar Factura',
      text: 'Ingrese La contraseña',
      input: 'password',
      inputPlaceholder: '************',
      showCancelButton: true,
    });

    if (value !== password) {
      Swal.fire('Contraseña Incorrecta', 'Verifica los datos', 'error');
    }

    if (value?.trim().length > 0 && value?.trim() === password) {
      this._facturaService.pagarFactura(id, this.token).subscribe((resp) => {
        this.toastr.success(`No. ${resp.facture_number}`, 'Factura pagada');
        this.getFacturas();
      });
    }
  }

  deleteFacture(id: string) {
    Swal.fire({
      title: 'Escriba la contraseña para borrar factura',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        // Swal.fire('Contraseña incorrecta', '', 'error');
        const resp = await this._passwordService.getPassword();

        const { clave, clave_empleado } = await resp.data();

        if (clave === login || clave_empleado === login) {
          this._facturaService.deleteFactura(id, this.token).subscribe(() => {
            this._router.navigate(['/contable/facturas'], {
              queryParams: {
                q: 1,
              },
            });
            this.getFacturas();
            this.toastr.success('Borrado!!', 'Factura eliminado correctamente');
          });
        } else {
          Swal.fire('Contraseña incorrecta', '', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {});
    // Swal.fire({
    //   title: '¿Estas seguro que deseas eliminar esta factura?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Si!',
    // }).then((result) => {
    //   if (result.value) {
    //     return this._facturaService
    //       .deleteFactura(id, this.token)
    //       .subscribe(() => {
    //         this._router.navigate(['/contable/facturas'], {
    //           queryParams: {
    //             q: 1,
    //           },
    //         });
    //         this.getFacturas();
    //         this.toastr.success('Borrado!!', 'Factura eliminado correctamente');
    //       });
    //   }
    // });
  }

  restoreFacura() {
    this._facturaService.restoreFactura(this.token).subscribe((resp) => {
      this.getFacturas();
      this.toastr.success(
        `No. ${resp.facture_number}, ahora puedes buscarlo en el buscador`,
        'Factura Restaurado!!'
      );
    });
  }

  search() {
    this.searchFactura.valueChanges
      .pipe(debounceTime(350))
      .subscribe((value: string) => {
        this.cargando = true;
        if (value?.trim().length !== 0) {
          if (value !== null) {
            this._router.navigate([], {
              queryParams: { search: value, page: this.pageSeach },
            });
          }

          this.searchFacturas(value, this.pageSeach);
        } else {
          this.cargando = false;
          this.existeSearch = false;
          this.pageSeach = 1;
          this.getFacturas();
          this._router.navigate([], { queryParams: { q: 1 } });
          return;
        }
      });
  }

  searchFacturas(value, page: number = 1) {
    this._facturaService.searchFactura(value, this.token, page).subscribe(
      (resp) => {
        this.existeSearch = true;
        this.facturas = resp.results;
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
        this.facturas = [];
      }
    );
  }
}
