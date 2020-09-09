import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalesService } from '@services/locales.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '@services/clients.service';
import { ClientSimple, Client } from '@interfaces/interfaces';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css'],
})
export class LocalesComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  clienteSimple: ClientSimple[] = [];
  token: string;
  id: string;
  error: any;
  cliente: string;

  constructor(
    private fb: FormBuilder,
    private _localesService: LocalesService,
    private _clientService: ClientsService,
    private _usService: UserService,
    private _activateRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.token = this._usService.getToken;
    this.loadId();
    this.createForm();
    if (this.id) {
      this.loadData();
    }
  }

  ngOnInit(): void {
    if (this.id) {
      this.getClient();
    }
  }

  ngOnDestroy() {
    if (this.id) {
      this.update().unsubscribe();
      this.getClient().unsubscribe();
      this.loadData().unsubscribe();
      this.loadId().unsubscribe();
    } else {
      this.save().unsubscribe();
    }
  }

  createForm() {
    this.forma = this.fb.group({
      client: [null],
      name: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', Validators.required],
      vat: ['', [Validators.required, Validators.maxLength(2)]],
      observation: ['', Validators.required],
    });
  }

  getValidadeFormName(name: string): boolean {
    return (
      this.forma.get(name)?.invalid &&
      (this.forma.get(name).touched || this.forma.get(name).dirty)
    );
  }

  save() {
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach((control) =>
        control.markAsTouched()
      );
    }

    if (this.forma.valid || !this.id) {
      return this._localesService
        .saveLocal(this.forma.value, this.token)
        .subscribe(
          (resp) => {
            this.forma.reset();
            this.toastr.success(
              `Nuevo Local ${resp.name}`,
              'Guardado Exitoxamente!!'
            );
          },
          (err) => {
            if (err.error.detail) {
              this.toastr.error(
                'Verifica tus credenciales',
                'Permiso Denegado'
              );
            }
          }
        );
    }
  }

  // UPDATE LOCALES
  update() {
    let local = {
      ...this.forma.value,
    };

    return this._localesService
      .updateLocal(this.id, local, this.token)
      .subscribe((resp) => {
        this.toastr.success('Local Actualizado Correctamente', `${resp.name}`);
      });
  }

  public get getClientValues(): string {
    return this.forma.get('client').value;
  }

  loadId() {
    return this._activateRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  loadData() {
    return this._localesService.getLocalesById(this.id, this.token).subscribe(
      (local) => {
        delete local.id;
        delete local.created_at;
        delete local.updated_at;
        delete local.active;
        this.forma.setValue({
          ...local,
          client: local?.client?.id || null,
        });
      },
      (err) => (this.error = err)
    );
  }

  getClient() {
    return this._clientService.getClientAll(this.token).subscribe((client) => {
      this.clienteSimple.push(...client.results);
    });

    // return this._clientService
    //   .getClientsToLocal(this.token)
    //   .subscribe((client) => {
    //     this.clienteSimple.push(...client);
    //   });
  }
}
