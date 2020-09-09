import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Locales } from '@interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@interfaces/interfaces';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.css'],
})
export class FormClientComponent implements OnInit {
  forma: FormGroup;
  localAndClient: Locales;
  @Input() client: Client;

  constructor(private fb: FormBuilder, private _activateRoute: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    this.setFormValues();
  }

  createForm() {
    this.forma = this.fb.group({
      name: [
        { value: '', disabled: true },
        ,
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      last_name: [
        { value: '', disabled: true },
        ,
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      enterprise_name: [{ value: '', disabled: true }],
      document_type: [{ value: '', disabled: true }, , Validators.required],
      document_number: [
        { value: '', disabled: true },
        ,
        [Validators.required, Validators.pattern('[0-9- ]+')],
      ],
      phone_number: [{ value: '', disabled: true }, , Validators.required],
      city: [
        { value: '', disabled: true },
        ,
        [Validators.required, Validators.pattern('[A-Za-z ]+')],
      ],
      direction: [{ value: '', disabled: true }, , Validators.required],
      neighborhood: [{ value: '', disabled: true }, Validators.required],
    });
  }

  setFormValues() {
    delete this.client.id;
    this.forma.setValue(this.client);
  }
}
