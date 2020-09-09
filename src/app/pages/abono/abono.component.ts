import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonosService } from '@services/abonos.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from '@services/factura.service';
import * as moment from 'moment';

@Component({
  selector: 'app-abono',
  templateUrl: './abono.component.html',
  styleUrls: ['./abono.component.css'],
})
export class AbonoComponent implements OnInit, OnDestroy {
  public id: number;
  public total_to_pay: number;
  public nombre = new FormControl('');
  public total_paid: number;
  public forma: FormGroup;
  private token: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _abonoService: AbonosService,
    private _facturaService: FacturaService,
    private toastr: ToastrService,
    private us_Service: UserService,
    private router: Router
  ) {
    this.token = this.us_Service.getToken;
    this.loadId();
  }

  ngOnInit(): void {
    this.getFactura();
    this.createForm();
  }

  ngOnDestroy() {
    this.loadId().unsubscribe();
  }

  createForm() {
    this.forma = this.fb.group({
      facture: [this.id],
      total_to_pay: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      // facture_date: ['', Validators.required],
    });
  }

  public get getTotalToPay(): boolean {
    return (
      this.forma.get('total_to_pay').invalid &&
      (this.forma.get('total_to_pay').dirty ||
        this.forma.get('total_to_pay').touched)
    );
  }

  public get getDateFacture(): boolean {
    return (
      this.forma.get('facture_date').invalid &&
      (this.forma.get('facture_date').dirty ||
        this.forma.get('facture_date').touched)
    );
  }

  loadId() {
    return this.activatedRoute.params.subscribe(({ id }) => {
      this.id = id;
    });
  }

  calcularPorcentaje(porcentaje = 0, cantidad) {
    return Number(porcentaje) !== 0
      ? cantidad + (porcentaje * cantidad) / 100
      : cantidad;
  }

  getFactura() {
    this._facturaService
      .getFacturaById(this.id, this.token)
      .subscribe((resp) => {
        const administracion = this.calcularPorcentaje(
          resp.administration_vat,
          resp.administration_price
        );
        const agua = this.calcularPorcentaje(
          resp.water_service_vat,
          resp.water_service_price
        );
        const luz = this.calcularPorcentaje(
          resp.energy_service_vat,
          resp.energy_service_price
        );

        this.total_to_pay = resp.place_price + administracion + agua + luz;
        this.total_paid = resp.total_paid;
        this.nombre.setValue(resp.client_name + ' ' + resp.client_last_name);
      });
  }

  guardarAbono() {
    const abono = {
      ...this.forma.value,
      facture_date: moment(new Date()).format('YYYY-MM-DD'),
    };

    this._abonoService.crearAbono(abono, this.token).subscribe(
      (resp) => {
        this.toastr.success('Abono creado exitosamente', 'Exitoso');
        setTimeout(() => {
          this.router.navigate(['/contable/abonos']);
        }, 4000);
      },
      (err) => {
        console.log(err);

        if (err?.error?.detail) {
          this.toastr.error(err.error.detail, 'Error');
        }
      }
    );
  }
}
