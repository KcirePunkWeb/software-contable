import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit, OnDestroy {
  public forma: FormGroup;
  id: string;
  token: string;
  error: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _clientService: ClientsService,
    private _activateRoute: ActivatedRoute,
    private _usService: UserService
  ) {
    this.token = this._usService.getToken;
    this.loadId();
    this.createForm();
    if (this.id) {
      this.loadData();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (!this.id) {
      this.save().unsubscribe();
    }
    this.loadId().unsubscribe();
    this.loadData().unsubscribe();
    this.update().unsubscribe();
  }

  createForm() {
    this.forma = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      enterprise_name: [''],
      document_type: ['nit', Validators.required],
      document_number: [
        '',
        [Validators.required, Validators.pattern('[0-9-]+')],
      ],
      phone_number: ['', Validators.required],
      city: ['', [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      neighborhood: ['', Validators.required],
      direction: ['', Validators.required],
    });
  }

  getValidadeFormName(name: string): boolean {
    return (
      this.forma.get(name)?.invalid &&
      (this.forma.get(name).touched || this.forma.get(name).dirty)
    );
  }

  getFormValues(name: string) {
    return this.forma.get(name).value;
  }

  save() {
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    if (this.forma.valid || !this.id) {
      return this._clientService
        .createClient(this.forma.value, this.token)
        .subscribe(
          () => {
            let inputs = document.querySelectorAll('input');
            inputs.forEach((input) => {
              input.blur();
            });
            this.toastr.success(
              `Nuevo Cliente ${this.getFormValues('name')}`,
              'Cliente Guardado Exitosamente!'
            );
            this.forma.reset();
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

  // UPDATE CLIENTE
  loadId() {
    return this._activateRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  loadData() {
    return this._clientService.getClientById(this.id, this.token).subscribe(
      (client) => {
        delete client.active;
        delete client.id;
        delete client.updated_at;
        delete client.created_at;
        this.forma.setValue({ ...client });
      },
      (err) => (this.error = err)
    );
  }

  update() {
    // if (this.forma.valid) {
    //   let cliente = {
    //     ...this.forma.value,
    //     id: this.id,
    //   };
    //   console.log(cliente);
    // }
    let cliente = {
      ...this.forma.value,
    };

    return this._clientService
      .updateClient(this.id, cliente, this.token)
      .subscribe((resp) => {
        this.toastr.success(
          'Cliente Actualizado Correctamente',
          `${resp.name}`
        );
      });
  }
}
