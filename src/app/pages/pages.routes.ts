import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ClientesComponent } from './clientes/clientes.component';
import { Notfound404Component } from '../notfound404/notfound404.component';
import { AuthGuard } from '../guards/auth.guard';
import { ListarClientesComponent } from './listar-clientes/listar-clientes.component';
import { LocalesComponent } from './locales/locales.component';
import { ListarLocalesComponent } from './listar-locales/listar-locales.component';
import { GenerarFacturaComponent } from './generar-factura/generar-factura.component';
import { FacturaComponent } from './factura/factura.component';
import { ListarFacturaComponent } from './listar-factura/listar-factura.component';
import { AbonoComponent } from './abono/abono.component';
import { ListarAbonosComponent } from './listar-abonos/listar-abonos.component';
import { RangeFactureComponent } from './range-facture/range-facture.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'contable',
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      { path: 'user', component: ClientesComponent },
      { path: 'users', component: ListarClientesComponent },
      { path: 'update-user/:id', component: ClientesComponent },
      { path: 'local', component: LocalesComponent },
      { path: 'locales', component: ListarLocalesComponent },
      { path: 'update-local/:id', component: LocalesComponent },
      { path: 'generar-factura/:id', component: GenerarFacturaComponent },
      { path: 'factura', component: FacturaComponent },
      { path: 'facturas', component: ListarFacturaComponent },
      { path: 'factura-rango', component: RangeFactureComponent },
      { path: 'abonos', component: ListarAbonosComponent },
      { path: 'abono/:id', component: AbonoComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '**', pathMatch: 'full', component: Notfound404Component },
    ],
  },
];

export const AppPagesRouting = RouterModule.forChild(routes);
