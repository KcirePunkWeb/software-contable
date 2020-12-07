import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacturaService } from '@services/factura.service';
import { UserService } from '@services/user.service';
import { Facture } from '@interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-imprimir',
  templateUrl: './imprimir.component.html',
  styleUrls: ['./imprimir.component.css'],
})
export class ImprimirComponent implements OnInit, OnDestroy {
  private token: string;
  public Factura: Partial<Facture> = {};
  public total_notIva: number;
  public total: number;
  public total_vat: number;

  constructor(
    private _facturaService: FacturaService,
    private _usService: UserService,
    private _activateRoute: ActivatedRoute,
    private _location: Location,
    private _router: Router
  ) {
    this.token = this._usService.getToken;
    this.getFactura();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.getFactura().unsubscribe();
  }

  getFactura() {
    return this._activateRoute.params.subscribe((resp) => {
      return this._facturaService
        .getFacturaById(resp['id'], this.token)
        .subscribe((resp) => {
          this.Factura = resp;
          this.calcularPrecios();
        });
    });
  }

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

    const placeVat = this.calcularTotal(
      this.Factura.place_vat,
      this.Factura.place_price
    );

    this.total_notIva =
      this.Factura.place_price +
      this.Factura.administration_price +
      this.Factura.water_service_price +
      this.Factura.energy_service_price;

    this.total_vat = this.Factura.place_price * 0.19;

    this.total = placeVat + administracion + agua + luz;
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
