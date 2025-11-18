import { Routes } from '@angular/router';
import { Shell } from './shared/layout/shell/shell';
import { HomePage } from './features/home/home.page/home.page';
import { CatalogPage } from './features/catalog/catalog.page/catalog.page';
import { DressDetail } from './features/catalog/dress-detail/dress-detail';
import { RentalsPage } from './features/rentals/rentals.page/rentals.page';
import { ProfilePage } from './features/profile/profile.page/profile.page';
import { LoginPage } from './features/auth/login.page/login.page';
import { RegisterPage } from './features/auth/register.page/register.page';
import { RecoverPage } from './features/auth/recover.page/recover.page';
import { AdminShell } from './features/admin/admin.shell/admin.shell';
import { Ajustes } from './features/admin/ajustes/ajustes';
import { VestidosPage } from './features/admin/vestidos/vestidos.page/vestidos.page';
import { Alquileres } from './features/admin/alquileres/alquileres';
import { Usuarios } from './features/admin/usuarios/usuarios';
import { Reportes } from './features/admin/reportes/reportes';
import { OverviewPage } from './features/admin/overview.page/overview.page';
import { Pagos } from './features/admin/pagos/pagos';
import { Carrito } from './features/carrito/carrito';
import { checkout } from './checkout/checkout/checkout';
import { ShoppingPage } from './features/shopping/shopping.page/shopping.page';
import { Ventas } from './features/admin/ventas/ventas';


export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'catalogo', component: CatalogPage },
      { path: 'vestido/:id', component: DressDetail },
      { path: 'mis-alquiler', component: RentalsPage },
      { path: 'mis-compras', component: ShoppingPage },
      { path: 'carrito', component: Carrito },
      { path: 'perfil', component: ProfilePage },
      { path: 'login', component: LoginPage },
      { path: 'registro', component: RegisterPage },
      { path: 'recuperar', component: RecoverPage },
      { path: 'checkout', component:checkout }
    ]
  },
  {
    path: 'admin',
    component: AdminShell,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: OverviewPage },
      { path: 'ajustes', component: Ajustes },
      { path: 'vestidos', component: VestidosPage },
      { path: 'alquileres', component: Alquileres },
      { path: 'ventas', component: Ventas },
      { path: 'pagos', component: Pagos },
      { path: 'usuarios', component: Usuarios },
      { path: 'reportes', component: Reportes }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
