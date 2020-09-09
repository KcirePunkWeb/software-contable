import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {

  public forma: FormGroup;
  public loading: boolean = false;
  private token: string;


  constructor(private fb: FormBuilder, private userService: UserService) {
    this.token = this.userService.getToken;
    this.forma = this.fb.group({
      username: [''],
      password: ['']
    })
  }

  guardar() {
    this.loading = true;

    const { username, password } = this.forma.value;

    if (username === '' && password !== '') {
      this.userService.updateProfile(this.token, { password }).subscribe(() => {
        this.loading = false;
        this.userService.logout()
      }, err => {
        console.log(err);
        this.loading = false;
      })
    } else if (username !== '' && password === '') {
      this.userService.updateProfile(this.token, { username }).subscribe(() => {
        this.loading = false;
        this.userService.logout()
      }, err => {
        console.log(err);
        this.loading = false;
      })
    } else {
      this.userService.updateProfile(this.token, this.forma.value).subscribe(() => {
        this.loading = false;
        this.userService.logout()
      }, err => {
        console.log(err);
        this.loading = false;
      })
    }

  }

}
