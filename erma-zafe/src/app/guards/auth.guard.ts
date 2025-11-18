import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service/auth.service';

// Define las rutas públicas aquí:
const publicRoutes = ['/login', '/registro', '/recuperar', '/home', '/catalogo', '/vestido'];

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const user = authService.currentUser();

  // Permitir acceso a rutas públicas
  if (publicRoutes.some(path => state.url.startsWith(path))) {
    // Si el usuario está logueado y quiere ir a login, redirige (opcional)
    if (state.url === '/login' && isLoggedIn) {
      if (user && user.role === 'admin') {
        router.navigate(['/admin']);
      } else {
        router.navigate(['/home']);
      }
      return false;
    }
    return true;
  }

  // Rutas admin: solo si es admin
  if (state.url.startsWith('/admin')) {
    if (isLoggedIn && user && user.role === 'admin') {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  }

  // Para cualquier otra ruta protegida
  if (isLoggedIn) {
    return true;
  }

  // Si no está autenticado, redirige a login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
