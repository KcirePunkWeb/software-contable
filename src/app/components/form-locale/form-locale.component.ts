import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Locales } from '../../interfaces/interfaces';

@Component({
  selector: 'app-form-locale',
  templateUrl: './form-locale.component.html',
  styleUrls: ['./form-locale.component.css'],
})
export class FormLocaleComponent implements OnInit {
  forma: FormGroup;
  @Input() local: Locales;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.setFormValues();
  }

  createForm() {
    this.forma = this.fb.group({
      client: [{ value: null, disabled: true }],
      name: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      vat: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(2)],
      ],
      observation: [{ value: '', disabled: true }, Validators.required],
    });
  }

  setFormValues() {
    delete this.local.id;
    this.forma.setValue({
      ...this.local,
      client: this.local.client.name,
    });
  }
}
