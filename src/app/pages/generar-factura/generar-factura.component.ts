import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalesService } from '@services/locales.service';
import { UserService } from '@services/user.service';
import { Client } from '@interfaces/interfaces';
import { Locales } from '@interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { FacturaService } from '@services/factura.service';
import * as moment from 'moment';

declare function NumeroALetras(num: number);

@Component({
  selector: 'app-generar-factura',
  templateUrl: './generar-factura.component.html',
  styleUrls: ['./generar-factura.component.css'],
})
export class GenerarFacturaComponent implements OnDestroy {
  private token: string;
  forma: FormGroup;
  price_humanized = new FormControl('', Validators.required);
  client: Client[] = [];
  local: Locales[] = [];
  total: number;
  totalEscrito: boolean = false;
  dataFactura: Locales;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _localService: LocalesService,
    private _usService: UserService,
    private _facturaService: FacturaService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.token = this._usService.getToken;
    this.getLocaleAndClient();
    this.createForm();
  }

  ngOnDestroy() {
    // this.generarFactura().unsubscribe();
    this.getLocaleAndClient().unsubscribe();
  }

  createForm() {
    this.forma = this.fb.group({
      administration_price: ['', Validators.required],
      water_service_price: ['', Validators.required],
      energy_service_price: ['', Validators.required],
      administration_vat: ['0', Validators.required],
      water_service_vat: ['0', Validators.required],
      energy_service_vat: ['0', Validators.required],
      facture_date: [new Date(), Validators.required],
      way_to_pay: ['efectivo'],
    });
  }

  getLocaleAndClient() {
    return this._activateRoute.params.subscribe((params) => {
      this._localService
        .getLocalesById(params['id'], this.token)
        .subscribe((resp) => {
          this.dataFactura = resp;

          // Datos del local que no se necesita en el form-local
          delete resp.active;
          delete resp.created_at;
          delete resp.updated_at;

          // Datos del cliente que no se necesita en el form-client
          delete resp.client.active;
          delete resp.client.created_at;
          delete resp.client.updated_at;
          this.client.push({ ...resp.client });
          this.local.push({ ...resp });
        });
    });
  }

  getValidadeFormName(name: string): boolean {
    return (
      this.forma.get(name)?.invalid &&
      (this.forma.get(name).touched || this.forma.get(name).dirty)
    );
  }

  calcularPorcentaje(porcentaje = 0, cantidad) {
    return Number(porcentaje) !== 0
      ? cantidad + (porcentaje * cantidad) / 100
      : cantidad;
  }

  calcular() {
    const administracion = this.calcularPorcentaje(
      Number(this.value('administration_vat')),
      this.value('administration_price')
    );
    const agua = this.calcularPorcentaje(
      Number(this.value('water_service_vat')),
      this.value('water_service_price')
    );
    const luz = this.calcularPorcentaje(
      Number(this.value('energy_service_vat')),
      this.value('energy_service_price')
    );

    const placeVat = this.calcularPorcentaje(
      this.dataFactura.vat,
      this.dataFactura.price
    );

    this.total = placeVat + administracion + agua + luz;
    this.price_humanized.setValue(NumeroALetras(this.total));

    this.totalEscrito = true;
  }

  public value(name): string | number {
    return this.forma.get(name).value;
  }

  generarFactura() {
    let {
      client: {
        name: client_name,
        last_name: client_last_name,
        enterprise_name: client_enterprise_name,
        document_type: client_document_type,
        document_number: client_document_number,
        city: client_city,
        phone_number: client_phone_number,
        direction: client_direction,
      },
      name: place_name,
      location: place_location,
      price: place_price,
      vat: place_vat,
    } = this.dataFactura;

    let body = {
      ...this.forma.value,
      client_name,
      client_last_name,
      client_enterprise_name,
      client_document_type,
      client_document_number,
      client_phone_number,
      client_city,
      client_direction,
      place_name,
      place_location,
      place_price,
      place_vat,
      total_to_pay: this.total,
      price_humanized: this.price_humanized.value,
      facture_date: moment(this.forma.get('facture_date').value).format(
        'YYYY-MM-DD'
      ),
    };

    return this._facturaService.generarFactura(body, this.token).subscribe(
      () => {
        this.toastr.success(
          'Puedes ir a buscarla en tu lista de factura',
          `Factura Creada!`
        );
      },
      (err) => {
        if (err?.error?.Detail) {
          this.toastr.error(err?.error?.Detail, 'Error');
        }
      }
    );
  }

  public getServicioCOP(name: string): number {
    return this.forma.get(name).value;
  }
}
