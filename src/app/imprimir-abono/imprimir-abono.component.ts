import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacturaService } from '@services/factura.service';
import { UserService } from '@services/user.service';
import { Facture } from '@interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbonosService } from '@services/abonos.service';
@Component({
  selector: 'app-imprimir-abono',
  templateUrl: './imprimir-abono.component.html',
  styleUrls: ['./imprimir-abono.component.css'],
})
export class ImprimirAbonoComponent implements OnInit, OnDestroy {
  private token: string;
  public Factura: Partial<Facture> = {};
  public total_notIva: number;
  public total: number;
  public total_vat: number;
  public total_to_pay: number;
  public cargando: boolean = false;

  constructor(
    private _facturaService: FacturaService,
    private _usService: UserService,
    private _activateRoute: ActivatedRoute,
    private _location: Location,
    private _abonoService: AbonosService,
    private _router: Router
  ) {
    this.token = this._usService.getToken;
    // this.getFactura();
  }

  ngOnInit() {
    this.getAbono();
  }

  ngOnDestroy() {
    // this.getFactura().unsubscribe();
  }

  getAbono() {
    this.cargando = true;
    this._activateRoute.params.subscribe((resp) => {
      this.cargando = false;
      this._abonoService
        .getAbonoById(this.token, resp['id'])
        .subscribe((resp) => {
          this.Factura = resp.facture;

          this.total_to_pay = resp.total_to_pay;
          this.calcularPrecios();
          this.cargando = false;
        });
    });
  }

  // getFactura() {
  //   return this._activateRoute.params.subscribe((resp) => {
  //     return this._facturaService
  //       .getFacturaById(resp['id'], this.token)
  //       .subscribe((resp) => {
  //         this.Factura = resp;
  //         this.calcularPrecios();
  //       });
  //   });
  // }

  calcularTotal(porcentaje = 0, cantidad, iva = false) {
    if (!iva) {
      return Number(porcentaje) !== 0
        ? cantidad + (porcentaje * cantidad) / 100
        : cantidad;
    }

    return Number(porcentaje) !== 0 ? (porcentaje * cantidad) / 100 : cantidad;
  }

  calcularPrecios() {
    let administracion = this.calcularTotal(
      this.Factura.administration_vat,
      this.Factura.administration_price
    );
    let agua = this.calcularTotal(
      this.Factura.water_service_vat,
      this.Factura.water_service_price
    );
    let luz = this.calcularTotal(
      this.Factura.energy_service_vat,
      this.Factura.energy_service_price
    );

    let administracion_vat = this.calcularTotal(
      this.Factura.administration_vat,
      this.Factura.administration_price,
      true
    );
    let agua_vat = this.calcularTotal(
      this.Factura.water_service_vat,
      this.Factura.water_service_price,
      true
    );
    let luz_vat = this.calcularTotal(
      this.Factura.energy_service_vat,
      this.Factura.energy_service_price,
      true
    );

    this.total_notIva =
      this.Factura.place_price +
      this.Factura.administration_price +
      this.Factura.water_service_price +
      this.Factura.energy_service_price;

    this.total_vat = this.Factura.place_price * 0.19;

    this.total =
      this.Factura.place_price + this.total_vat + administracion + agua + luz;
  }

  generarPDF() {
    window.print();
  }

  atras() {
    if (window.history.length < 5) {
      this._router.navigate(['/contable/users']);
    } else {
      this._location.back();
    }
  }
}
