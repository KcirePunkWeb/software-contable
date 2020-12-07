import { PasswordService } from './../../services/password.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent {
  public forma: FormGroup;
  public loading: boolean = false;
  private token: string;
  public passwordForma: FormGroup;
  public passwordForma2: FormGroup;
  public mostrarPass: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private passwordService: PasswordService
  ) {
    this.token = this.userService.getToken;
    this.forma = this.fb.group({
      username: [''],
      password: [''],
    });

    this.passwordForma = this.fb.group(
      {
        changePass: ['', Validators.required],
        password: ['', Validators.required],
        password2: ['', Validators.required],
      },
      {
        validators: this.passwordIguales('password', 'password2'),
      }
    );

    this.passwordForma2 = this.fb.group(
      {
        changePass: ['', Validators.required],
        admin: ['', Validators.required],
        password: ['', Validators.required],
        password2: ['', Validators.required],
      },
      {
        validators: this.passwordIguales('password', 'password2'),
      }
    );
  }

  guardar() {
    this.loading = true;

    const { username, password } = this.forma.value;

    if (username === '' && password !== '') {
      this.userService.updateProfile(this.token, { password }).subscribe(
        () => {
          this.loading = false;
          this.userService.logout();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    } else if (username !== '' && password === '') {
      this.userService.updateProfile(this.token, { username }).subscribe(
        () => {
          this.loading = false;
          this.userService.logout();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    } else {
      this.userService.updateProfile(this.token, this.forma.value).subscribe(
        () => {
          this.loading = false;
          this.userService.logout();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }
  }

  passwordIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1C = formGroup.controls[pass1];
      const pass2C = formGroup.controls[pass2];
      if (pass1C.value === pass2C.value) {
        pass2C.setErrors(null);
      } else {
        pass2C.setErrors({ noEsIgual: true });
      }
    };
  }

  async cambiarContrasena() {
    const resp = await this.passwordService.getPassword();

    const { clave } = resp.data();

    const pass1 = this.passwordForma.get('changePass').value;
    console.log(pass1, clave);

    if (pass1 === clave) {
      const newpPassword = this.passwordForma.get('password').value;

      this.passwordService.cambiarPasswordAdmin(newpPassword);
      Swal.fire('Cambio de contraseña exitoso', '', 'success');
    } else {
      Swal.fire('Contraseña incorrecta', '', 'error');
    }
  }

  public get pass1NoValido() {
    return (
      this.passwordForma.get('password').invalid &&
      this.passwordForma.get('password').touched
    );
  }

  public get pass2NoValido() {
    const pass1 = this.passwordForma.get('password').value;
    const pass2 = this.passwordForma.get('password2').value;

    return pass1 === pass2 ? false : true;
  }

  public get pass1NoValido2() {
    return (
      this.passwordForma2.get('password').invalid &&
      this.passwordForma2.get('password').touched
    );
  }

  public get pass2NoValido2() {
    const pass1 = this.passwordForma2.get('password').value;
    const pass2 = this.passwordForma2.get('password2').value;

    return pass1 === pass2 ? false : true;
  }

  async cambiarContrasena2() {
    const resp = await this.passwordService.getPassword();

    const { clave_empleado, clave } = resp.data();

    const pass1 = this.passwordForma2.get('changePass').value;
    const admin = this.passwordForma2.get('admin').value;

    if (pass1 === clave_empleado && admin === clave) {
      const newpPassword = this.passwordForma2.get('password').value;

      this.passwordService.cambiarPasswordEmpleado(newpPassword);
      Swal.fire('Cambio de contraseña exitoso', '', 'success');
    } else {
      Swal.fire('Contraseña incorrecta', '', 'error');
    }
  }

  public mostrar() {
    this.mostrarPass = !this.mostrarPass;
  }
}
