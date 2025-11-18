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
import { Checkout } from './checkout/checkout/checkout';
import { ConfectionsNv } from './features/confections/confections-nv/confections-nv';
import { ConfectionsFS } from './features/confections/confections-f-s/confections-f-s';
import { ConfectionsIV } from './features/confections/confections-iv/confections-iv';
import { MaintenanceList } from './features/admin/maintenance/maintenance-list/maintenance-list';
import { MaintenanceCreate } from './features/admin/maintenance/maintenance-create/maintenance-create';

// Elimina el import y uso del authGuard

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
      { path: 'carrito', component: Carrito },
      { path: 'perfil', component: ProfilePage },
      { path: 'confeccion-nv', component: ConfectionsNv },
      { path: 'confeccion-FS', component: ConfectionsFS },
      { path: 'confeccion-IV', component: ConfectionsIV },
      { path: 'checkout', component: Checkout },
      { path: 'login', component: LoginPage },
      { path: 'registro', component: RegisterPage },
      { path: 'recuperar', component: RecoverPage }
    ]
  },
  {
    path: 'admin',
    component: AdminShell,
    // sin guard, acceso abierto al módulo admin
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: OverviewPage },
      { path: 'ajustes', component: Ajustes },
      { path: 'vestidos', component: VestidosPage },
      { path: 'alquileres', component: Alquileres },
      { path: 'pagos', component: Pagos },
      { path: 'usuarios', component: Usuarios },
      { path: 'mantenimiento', component: MaintenanceList },
      { path: 'mantenimiento/create', component: MaintenanceCreate },
      { path: 'reportes', component: Reportes }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
