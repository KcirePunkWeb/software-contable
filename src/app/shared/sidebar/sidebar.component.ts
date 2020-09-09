import { Component } from '@angular/core';
import { Navegacion } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  public routerLinkClient: Navegacion[] = [
    { name: 'Crear Clientes', url: '/contable/user' },
    { name: 'Lista De Clientes', url: '/contable/users' },
  ];

  public routerLinkLocal: Navegacion[] = [
    { name: 'Crear Local', url: '/contable/local' },
    { name: 'Lista De Locales', url: '/contable/locales' },
  ];

  public routerLinkFacturas: Navegacion[] = [
    { name: 'Lista De Facturas', url: '/contable/facturas' },
    { name: 'Rango De Factura', url: '/contable/factura-rango' },
  ];

  public routerLinkAbonos: Navegacion[] = [
    { name: 'Lista De Abonos', url: '/contable/abonos' },
  ];

  public routerLinkUser: Navegacion[] = [
    { name: 'Ajuste De Cuenta', url: '/contable/profile' },
  ];

  constructor(private usService: UserService) {}

  logout() {
    this.usService.logout();
  }
}
