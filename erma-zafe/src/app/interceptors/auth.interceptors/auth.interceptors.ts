import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next
) => {
  const authService = inject(AuthService);

  // ✅ NO agregar token a /register (es público)
  if (request.url.includes('/auth/register')) {
    console.log('⏭️ Saltando interceptor para /register');
    return next(request);
  }

  const token = authService.getToken();

  if (token) {
    console.log('✅ Agregando JWT al header');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ Sin token disponible');
  }

  return next(request);
};
