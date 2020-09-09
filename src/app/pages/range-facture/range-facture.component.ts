import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacturaService } from '@services/factura.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-range-facture',
  templateUrl: './range-facture.component.html',
  styles: [],
})
export class RangeFactureComponent implements OnInit {
  public rangeForm: FormGroup;
  private token: string;
  public range: any;
  public lastRange: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,

    private _facturaService: FacturaService,
    private usService: UserService
  ) {
    this.token = this.usService.getToken;
    this.rangeForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._facturaService.getRangoFactura(this.token).subscribe((resp: any) => {
      this.range = resp[0].value.split(',').join(' - ');
      this.lastRange = resp[1].value;
    });
  }

  guardar() {
    this._facturaService
      .definitRangoFactura(this.rangeForm.value, this.token)
      .subscribe(
        (resp) => {
          this.toastr.info('Nuevo rango definido', 'Actualizado');
        },
        (err) => {
          this.toastr.error(err.error.detail, 'Error');
        }
      );
  }
}
