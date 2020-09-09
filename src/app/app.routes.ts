import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './SignInSignUp/login/login.component';
import { Notfound404Component } from './notfound404/notfound404.component';
import { RegisterComponent } from './SignInSignUp/register/register.component';
import { ImprimirComponent } from './imprimir/imprimir.component';
import { ImprimirAbonoComponent } from './imprimir-abono/imprimir-abono.component';
import { BlockLoginGuard } from './guards/block-login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', canActivate: [BlockLoginGuard], component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'imprimir/:id', component: ImprimirComponent },
  { path: 'imprimir-abono/:id', component: ImprimirAbonoComponent },
  { path: '**', pathMatch: 'full', component: Notfound404Component },
];

export const AppRouting = RouterModule.forRoot(routes, { useHash: true });
