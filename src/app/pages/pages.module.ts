// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppPagesRouting } from './pages.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
// import { HttpClientModule } from '@angular/common/http';

// Components
import { PagesComponent } from './pages.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ListarClientesComponent } from './listar-clientes/listar-clientes.component';
import { LocalesComponent } from './locales/locales.component';
import { ListarLocalesComponent } from './listar-locales/listar-locales.component';
import { GenerarFacturaComponent } from './generar-factura/generar-factura.component';
import { ComponentsModule } from '../components/components.module';
import { FacturaComponent } from './factura/factura.component';
import { ListarFacturaComponent } from './listar-factura/listar-factura.component';
import { AbonoComponent } from './abono/abono.component';
import { ListarAbonosComponent } from './listar-abonos/listar-abonos.component';
import { RangeFactureComponent } from './range-facture/range-facture.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    PagesComponent,
    ClientesComponent,
    ListarClientesComponent,
    LocalesComponent,
    ListarLocalesComponent,
    GenerarFacturaComponent,
    FacturaComponent,
    ListarFacturaComponent,
    AbonoComponent,
    ListarAbonosComponent,
    RangeFactureComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppPagesRouting,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MomentModule,
  ],
})
export class PagesModule {}
