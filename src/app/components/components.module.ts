import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormClientComponent } from './form-client/form-client.component';
import { FormLocaleComponent } from './form-locale/form-locale.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormClientComponent, FormLocaleComponent],
  exports: [FormClientComponent, FormLocaleComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ComponentsModule {}
